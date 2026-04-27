import {
  find,
  filter,
  get,
  identity,
  map,
  omit,
  reduce,
  isObject,
  each,
  isEmpty,
} from 'lodash'
import juice from 'juice'
import { load } from 'cheerio'
import minifier from 'htmlnano'
import MJMLParser from 'mjml-parser-xml'
import MJMLValidator, {
  dependencies as globalDependencies,
  assignDependencies,
} from 'mjml-validator'

import { initComponent } from './createComponent'
import globalComponents, {
  registerComponent,
  assignComponents,
} from './components'

import makeLowerBreakpoint from './helpers/makeLowerBreakpoint'
import suffixCssClasses from './helpers/suffixCssClasses'
import mergeOutlookConditionnals from './helpers/mergeOutlookConditionnals'
import minifyOutlookConditionnals from './helpers/minifyOutlookConditionnals'
import defaultSkeleton from './helpers/skeleton'
import loadSkeletonFromFile from './node-only/skeleton-loader'
import { initializeType } from './types/type'

import handleMjmlConfig, {
  readMjmlConfig,
  handleMjmlConfigComponents,
} from './helpers/mjmlconfig'

const isNode = require('detect-node')
const fs = require('fs')
const path = require('path')

const cssnanoLitePreset = require('cssnano-preset-lite')

function normalizeMinifyCssOption(minifyCss) {
  if (minifyCss === 'lite') {
    return { preset: cssnanoLitePreset }
  }

  if (minifyCss && typeof minifyCss === 'object') {
    if (minifyCss.preset === 'lite') {
      return { ...minifyCss, preset: cssnanoLitePreset }
    }

    if (Array.isArray(minifyCss.preset) && minifyCss.preset[0] === 'lite') {
      return {
        ...minifyCss,
        preset: [cssnanoLitePreset, minifyCss.preset[1] || {}],
      }
    }
  }

  return minifyCss
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function sanitizeInlineStyleAttributes(html, syntaxes) {
  return html.replace(/style="([^"]*)"/g, (match, styleValue) => {
    let sanitizedValue = styleValue
    syntaxes.forEach(({ prefix, suffix }, idx) => {
      const regex = new RegExp(
        `(\\s*)${escapeRegex(prefix)}\\s*([\\s\\S]*?)\\s*${escapeRegex(suffix)}(\\s*)`,
        'g',
      )
      sanitizedValue = sanitizedValue.replace(
        regex,
        (m, leading, variable, trailing) => `${leading}sanitized${idx}:${variable};${trailing}`,
      )
    })
    sanitizedValue = sanitizedValue.replace(/;$/, '')
    return `style="${sanitizedValue}"`
  })
}

function restoreInlineStyleAttributes(html, syntaxes) {
  return html.replace(/style="([^"]*)"/g, (match, styleValue) => {
    let restoredValue = styleValue
    syntaxes.forEach(({ prefix, suffix }, idx) => {
      const regex = new RegExp(`sanitized${idx}:([\\s\\S]*?)(;|$)`, 'g')
      restoredValue = restoredValue.replace(regex, `${prefix}$1${suffix}`)
    })
    restoredValue = restoredValue.replace(/;$/, '')
    return `style="${restoredValue}"`
  })
}

function sanitizeStyleTagBlocks(html, syntaxes) {
  return html.replace(/<style(?:\b[^>]*)?>([\s\S]*?)<\/style\s*>/g, (block, content) => {
    let sanitizedContent = content
    syntaxes.forEach(({ prefix, suffix }, idx) => {
      const regex = new RegExp(
        `\\s*${escapeRegex(prefix)}([\\s\\S]*?)${escapeRegex(suffix)}\\s*`,
        'g',
      )
      sanitizedContent = sanitizedContent.replace(regex, `sanitized${idx}:$1;`)
    })
    return block.replace(content, sanitizedContent)
  })
}

function restoreStyleTagBlocks(html, syntaxes) {
  return html.replace(/sanitized(\d):([\s\S]*?);/g, (match, idx, variable) => {
    const { prefix, suffix } = syntaxes[Number(idx)] || {}
    if (!prefix || !suffix) return match
    return `${prefix}${variable}${suffix}`
  })
}

function sanitizeCssValueVariablesHtml(html, syntaxes) {
  let counter = 0
  const variableMap = {}

  // style="..."
  let result = html.replace(/style="([^"]*)"/g, (match, styleValue) => {
    let sanitizedValue = styleValue
    const matches = []

    syntaxes.forEach(({ prefix, suffix }) => {
      const regex = new RegExp(
        `:\\s*${escapeRegex(prefix)}\\s*([\\s\\S]*?)\\s*${escapeRegex(suffix)}`,
        'g',
      )
      let m = regex.exec(styleValue)
      while (m) {
        // capture the full token only (prefix...suffix)
        const fullToken = m[0].replace(/^\s*:\s*/, '')
        matches.push({ index: m.index, full: fullToken })
        m = regex.exec(styleValue)
      }
    })

    matches.sort((a, b) => a.index - b.index)
    matches.forEach(({ full }) => {
      const tempVar = `variable_temp_${counter}`
      variableMap[tempVar] = full
      sanitizedValue = sanitizedValue.replace(full, ` ${tempVar} `)
      counter += 1
    })

    sanitizedValue = sanitizedValue.replace(/\s+/g, ' ').trim()
    return `style="${sanitizedValue}"`
  })

  // <style> ... </style>
  result = result.replace(/<style(?:\b[^>]*)?>([\s\S]*?)<\/style\s*>/g, (block, content) => {
    let sanitizedContent = content
    const styleMatches = []

    syntaxes.forEach(({ prefix, suffix }) => {
      const regex = new RegExp(
          `:\\s*${escapeRegex(prefix)}\\s*([\\s\\S]*?)\\s*${escapeRegex(suffix)}`,
          'g',
        'g',
      )
      let m = regex.exec(content)
      while (m) {
        const fullToken = m[0].replace(/^\s*:\s*/, '')
        styleMatches.push({ index: m.index, full: fullToken })
        m = regex.exec(content)
      }
    })

    styleMatches.sort((a, b) => a.index - b.index)
    styleMatches.forEach(({ full }) => {
      const tempVar = `variable_temp_${counter}`
      variableMap[tempVar] = full
      sanitizedContent = sanitizedContent.replace(full, ` ${tempVar} `)
      counter += 1
    })

    return block.replace(content, sanitizedContent)
  })

  return { result, variableMap }
}

function restoreCssValueVariablesHtml(html, variableMap) {
  let restoredHtml = html
  Object.entries(variableMap).forEach(([tempVar, originalVar]) => {
    const regex = new RegExp(`\\b${tempVar}\\b`, 'g')
    restoredHtml = restoredHtml.replace(regex, originalVar)
  })
  return restoredHtml
}

function sanitizeCssPropertyVariablesHtml(html, syntaxes) {
  let counter = 0
  const propMap = {}

  // style="..."
  let result = html.replace(/style="([^"]*)"/g, (match, styleValue) => {
    let sanitizedValue = styleValue
    const matches = []

    syntaxes.forEach(({ prefix, suffix }) => {
      const regex = new RegExp(
        `${escapeRegex(prefix)}\\s*([\\s\\S]*?)\\s*${escapeRegex(suffix)}\\s*:`,
        'g',
      )
      let m = regex.exec(styleValue)
      while (m) {
        matches.push({ index: m.index, full: m[0], varOnly: m[1] })
        m = regex.exec(styleValue)
      }
    })

    // Replace from left to right
    matches.sort((a, b) => a.index - b.index)
    matches.forEach(({ full }) => {
      const tempVar = `--mj-prop-temp_${counter}`
      const originalToken = full.replace(/\s*:\s*$/, '')
      propMap[tempVar] = originalToken
      sanitizedValue = sanitizedValue.replace(full, `${tempVar}:`)
      counter += 1
    })

    sanitizedValue = sanitizedValue.replace(/\s+/g, ' ').trim()
    return `style="${sanitizedValue}"`
  })

  // <style> ... </style>
  result = result.replace(/<style(?:\b[^>]*)?>([\s\S]*?)<\/style\s*>/g, (block, content) => {
    let sanitizedContent = content
    const styleMatches = []

    syntaxes.forEach(({ prefix, suffix }) => {
      const regex = new RegExp(
        `${escapeRegex(prefix)}\\s*([\\s\\S]*?)\\s*${escapeRegex(suffix)}\\s*:`,
        'g',
      )
      let m = regex.exec(content)
      while (m) {
        styleMatches.push({ index: m.index, full: m[0], varOnly: m[1] })
        m = regex.exec(content)
      }
    })

    styleMatches.sort((a, b) => a.index - b.index)
    styleMatches.forEach(({ full }) => {
      const tempVar = `--mj-prop-temp_${counter}`
      const originalToken = full.replace(/\s*:\s*$/, '')
      propMap[tempVar] = originalToken
      sanitizedContent = sanitizedContent.replace(full, `${tempVar}:`)
      counter += 1
    })

    return block.replace(content, sanitizedContent)
  })

  return { result, propMap }
}

function restoreCssPropertyVariablesHtml(html, propMap) {
  let restoredHtml = html
  Object.entries(propMap).forEach(([tempVar, originalVar]) => {
    const regex = new RegExp(`${escapeRegex(tempVar)}\\s*:`, 'g')
    restoredHtml = restoredHtml.replace(regex, `${originalVar}:`)
  })
  return restoredHtml
}

function detectVariableTypeInHtml(html, syntaxes) {
  const styleAttrValues = []
  html.replace(/style="([^"]*)"/g, (m, val) => {
    styleAttrValues.push(val)
    return m
  })
  const styleBlockValues = []
  html.replace(/<style(?:\b[^>]*)?>([\s\S]*?)<\/style\s*>/g, (m, val) => {
    styleBlockValues.push(val)
    return m
  })
  const styleContent = [...styleAttrValues, ...styleBlockValues].join('\n')

    const cssValuePattern = syntaxes
      .map(({ prefix }) => `[a-z-]+\\s*:\\s*[^;}"]*${escapeRegex(prefix)}`)
    .join('|')

  const isValueVariable = new RegExp(cssValuePattern, 'i').test(styleContent)

  const cssPropertyPattern = syntaxes
    .map(({ prefix, suffix }) => `${escapeRegex(prefix)}[^${escapeRegex(prefix)}${escapeRegex(suffix)}]*${escapeRegex(suffix)}\\s*:`)
    .join('|')
  const isPropertyVariable = new RegExp(cssPropertyPattern, 'i').test(styleContent)

  const allVariablesPattern = syntaxes
    .map(({ prefix, suffix }) => `${escapeRegex(prefix)}[^${escapeRegex(prefix)}${escapeRegex(suffix)}]*${escapeRegex(suffix)}`)
    .join('|')

  const allVariablesRegex = new RegExp(allVariablesPattern, 'g')
  let isBlockVariable = false

  let match = allVariablesRegex.exec(styleContent)
  while (match) {
    const beforeVar = styleContent.substring(0, match.index)
    const afterIndex = match.index + match[0].length
    const afterVar = styleContent.substring(afterIndex)
    const isCssValueCtx = /:[^;{]*$/.test(beforeVar)
    const isCssPropertyCtx = /^\s*:/.test(afterVar)
    if (!isCssValueCtx && !isCssPropertyCtx) {
      isBlockVariable = true
      break
    }
    match = allVariablesRegex.exec(styleContent)
  }

  return { isBlockVariable, isValueVariable, isPropertyVariable }
}

function detectBrokenTemplateDelimitersInCss(html, syntaxes) {
  const styleAttrValues = []
  html.replace(/style="([^"]*)"/g, (m, val) => {
    styleAttrValues.push(val)
    return m
  })
  const styleBlockValues = []
  html.replace(/<style(?:\b[^>]*)?>([\s\S]*?)<\/style\s*>/g, (m, val) => {
    styleBlockValues.push(val)
    return m
  })
  const styleContent = [...styleAttrValues, ...styleBlockValues].join('\n')

  const broken = []
  syntaxes.forEach(({ prefix, suffix }) => {
    const prefixRegex = new RegExp(escapeRegex(prefix), 'g')
    const suffixRegex = new RegExp(escapeRegex(suffix), 'g')
    const prefixCount = (styleContent.match(prefixRegex) || []).length
    const suffixCount = (styleContent.match(suffixRegex) || []).length
    if (prefixCount !== suffixCount) {
      broken.push({ prefix, suffix, prefixCount, suffixCount })
    }
  })

  return broken
}

class ValidationError extends Error {
  constructor(message, errors) {
    super(message)

    this.errors = errors
  }
}

function getTemplateDelimiterRecoveryMessage(contextName) {
  if (
    typeof contextName === 'string' &&
    contextName.toLowerCase() === 'css minification'
  ) {
    return 'Fix template tokens or disable CSS minification with minifyOptions.minifyCSS = false.'
  }
  return `Fix template tokens or disable ${contextName}.`
}

/**
 * Sanitize template syntax in HTML content if enabled
 * Detects and replaces CSS value/property variables and block variables with placeholders
 * @param {string} html - HTML content
 * @param {boolean} shouldSanitize - Whether to perform sanitization
 * @param {Array} syntaxes - Template syntax delimiters
 * @param {boolean} allowMixedSyntax - Whether to allow mixed variable syntax
 * @param {string} contextName - Name for error messages
 * @returns {{ content: string, didSanitize: boolean, variableMap: object, propMap: object, isBlockVariable: boolean }}
 */
function sanitizeTemplateVariablesInHtml(html, shouldSanitize, syntaxes, allowMixedSyntax, contextName) {
  const result = {
    content: html,
    didSanitize: false,
    variableMap: {},
    propMap: {},
    isBlockVariable: false,
  }

  if (!shouldSanitize) {
    return result
  }

  const broken = detectBrokenTemplateDelimitersInCss(html, syntaxes)
  if (broken.length) {
    const details = broken
      .map(
        (b) => `${b.prefix}…${b.suffix} (${b.prefixCount} open, ${b.suffixCount} close)`,
      )
      .join(', ')
    throw new Error(
      `Unbalanced template delimiters found in CSS: ${details}. ${getTemplateDelimiterRecoveryMessage(contextName)}`,
    )
  }

  const detected = detectVariableTypeInHtml(html, syntaxes)
  result.isBlockVariable = detected.isBlockVariable

  if (!allowMixedSyntax && result.isBlockVariable && (detected.isValueVariable || detected.isPropertyVariable)) {
    throw new Error(
      'Mixed variable syntax detected. Use either CSS property syntax (e.g., color: {{variable}}) OR block syntax (e.g., {{variable}}), not both in the same document.',
    )
  }

  if (detected.isValueVariable) {
    const sanitized = sanitizeCssValueVariablesHtml(html, syntaxes)
    result.content = sanitized.result
    result.variableMap = sanitized.variableMap
    result.didSanitize = true
  }

  if (detected.isPropertyVariable) {
    const sanitizedProp = sanitizeCssPropertyVariablesHtml(result.content, syntaxes)
    result.content = sanitizedProp.result
    result.propMap = sanitizedProp.propMap
    result.didSanitize = true
  }

  if (result.isBlockVariable) {
    result.content = sanitizeInlineStyleAttributes(result.content, syntaxes)
    result.content = sanitizeStyleTagBlocks(result.content, syntaxes)
    result.didSanitize = true
  }

  return result
}

/**
 * Restore template syntax placeholders in HTML content
 * @param {string} html - HTML content with placeholders
 * @param {object} variableMap - Map of CSS value variable placeholders to restore
 * @param {object} propMap - Map of CSS property variable placeholders to restore
 * @param {boolean} isBlockVariable - Whether block variables were detected
 * @param {Array} syntaxes - Template syntax delimiters
 * @returns {string} HTML with restored template variables
 */
function restoreTemplateVariablesInHtml(html, variableMap, propMap, isBlockVariable, syntaxes) {
  let restoredContent = html

  if (variableMap && Object.keys(variableMap).length > 0) {
    restoredContent = restoreCssValueVariablesHtml(restoredContent, variableMap)
  }

  if (propMap && Object.keys(propMap).length > 0) {
    restoredContent = restoreCssPropertyVariablesHtml(restoredContent, propMap)
  }

  if (isBlockVariable) {
    restoredContent = restoreInlineStyleAttributes(restoredContent, syntaxes)
    restoredContent = restoreStyleTagBlocks(restoredContent, syntaxes)
  }

  return restoredContent
}

export default async function mjml2html(mjml, options = {}) {
  let content = ''
  let errors = []

  // Resolve skeleton path via node-only helper to avoid dynamic require in browser builds
  if (isNode && typeof options.skeleton === 'string') {
    const loadSkeleton =
      loadSkeletonFromFile.default ||
      loadSkeletonFromFile.loadSkeleton ||
      loadSkeletonFromFile
    const loadedSk = loadSkeleton && loadSkeleton(options.skeleton)
    if (loadedSk) {
      options.skeleton = loadedSk
    }
  }

  let packages = {}
  let confOptions = {}
  let mjmlConfigOptions = {}
  let confPreprocessors = []
  let error = null
  let componentRootPath = null

  // Use the existing readMjmlConfig helper
  if ((isNode && options.useMjmlConfigOptions) || options.mjmlConfigPath) {
    const mjmlConfigContent = readMjmlConfig(options.mjmlConfigPath)

    if (mjmlConfigContent) {
      // The options can be nested one or two levels deep.
      // This safely gets the options from either structure.
      confOptions =
        get(mjmlConfigContent, 'mjmlConfig.mjmlConfig.options') || // For double-nested structure
        get(mjmlConfigContent, 'mjmlConfig.options') || // For single-nested structure
        get(mjmlConfigContent, 'options') || // If options are at the top level
        confOptions

      // This safely gets packages and preprocessors
      const packagesWrapper =
        get(mjmlConfigContent, 'mjmlConfig.mjmlConfig') ||
        get(mjmlConfigContent, 'mjmlConfig') ||
        mjmlConfigContent
      packages = packagesWrapper.packages || packages
      confPreprocessors = packagesWrapper.preprocessors || confPreprocessors

      componentRootPath =
        mjmlConfigContent.componentRootPath || componentRootPath
      error = mjmlConfigContent.error || error
    }

    if (options.useMjmlConfigOptions) {
      mjmlConfigOptions = confOptions || {}
    }
  }

  // if mjmlConfigPath is specified then we need to register components it on each call
  if (isNode && !error && options.mjmlConfigPath) {
    if (Array.isArray(packages) && packages.length > 0) {
      handleMjmlConfigComponents(packages, componentRootPath, registerComponent)
    }
  }

  // Merge config options with explicit options (explicit wins)
  const mergedOptions = {
    ...mjmlConfigOptions,
    ...options,
    // Deep merge minifyOptions
    minifyOptions: {
      ...(mjmlConfigOptions.minifyOptions || {}),
      ...(options.minifyOptions || {}),
    },
    // Merge preprocessors arrays
    preprocessors: options.preprocessors
      ? [...confPreprocessors, ...options.preprocessors]
      : confPreprocessors,
  }

  const {
    beautify = false,
    fonts = {
      'Open Sans':
        'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700',
      'Droid Sans':
        'https://fonts.googleapis.com/css?family=Droid+Sans:300,400,500,700',
      Lato: 'https://fonts.googleapis.com/css?family=Lato:300,400,500,700',
      Roboto: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      Ubuntu: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700',
    },
    keepComments = true,
    minify = false,
    minifyOptions,
    ignoreIncludes = true,
    juiceOptions = {},
    juicePreserveTags = null,
    skeleton = defaultSkeleton,
    validationLevel = 'soft',
    filePath = '.',
    actualPath = '.',
    preprocessors,
    presets = [],
    printerSupport = false,
    sanitizeStyles = false,
    templateSyntax,
    allowMixedSyntax = false,
    includePath,
  } = mergedOptions

  const components = { ...globalComponents }
  const dependencies = assignDependencies({}, globalDependencies)
  for (const preset of presets) {
    assignComponents(components, preset.components)
    assignDependencies(dependencies, preset.dependencies)
  }

  if (typeof mjml === 'string') {
    const pathsArr = []
    if (Array.isArray(includePath)) {
      pathsArr.push(
        ...includePath.filter((p) => typeof p === 'string' && p.length > 0),
      )
    } else if (includePath) {
      pathsArr.push(includePath)
    }

    if (pathsArr.length) {
      let base = filePath || '.'
      if (fs.existsSync(base)) {
        const isDir = fs.lstatSync(base).isDirectory()
        base = isDir ? base : path.dirname(base)
      } else {
        base = process.cwd()
      }
      const baseReal = fs.existsSync(base) ? fs.realpathSync(base) : base
      for (const p of pathsArr) {
        if (fs.existsSync(p)) {
          const r = fs.realpathSync(p)
          const relToBase = path.relative(baseReal, r)
          const isOutsideBase =
            !relToBase ||
            relToBase.startsWith('..') ||
            path.isAbsolute(relToBase)
          const isRootDir = r === path.parse(r).root
          if (isRootDir || isOutsideBase) {
            // eslint-disable-next-line no-console
            console.warn(
              `[MJML security] includePath "${p}" is outside the template base "${baseReal}"${
                isRootDir ? ' (root directory)' : ''
              }. Consider scoping includePath to a project templates folder.`,
            )
          }
        }
      }
    }

    mjml = MJMLParser(mjml, {
      keepComments,
      components,
      filePath,
      actualPath,
      preprocessors,
      ignoreIncludes,
      includePath,
    })
  }

  const globalData = {
    beforeDoctype: '',
    breakpoint: '480px',
    classes: {},
    classesDefault: {},
    defaultAttributes: {},
    htmlAttributes: {},
    fonts,
    inlineStyle: [],
    headStyle: {},
    componentsHeadStyle: [],
    headRaw: [],
    mediaQueries: {},
    preview: '',
    style: [],
    title: '',
    forceOWADesktop: get(mjml, 'attributes.owa', 'mobile') === 'desktop',
    lang: get(mjml, 'attributes.lang') || 'und',
    dir: get(mjml, 'attributes.dir') || 'auto',
  }

  const validatorOptions = {
    components,
    dependencies,
    initializeType,
  }

  switch (validationLevel) {
    case 'skip':
      break

    case 'strict':
      errors = MJMLValidator(mjml, validatorOptions)

      if (errors.length > 0) {
        throw new ValidationError(
          `ValidationError: \n ${errors
            .map((e) => e.formattedMessage)
            .join('\n')}`,
          errors,
        )
      }
      break

    case 'soft':
    default:
      errors = MJMLValidator(mjml, validatorOptions)
      break
  }

  const mjBody = find(mjml.children, { tagName: 'mj-body' })
  const mjHead = find(mjml.children, { tagName: 'mj-head' })
  const mjOutsideRaws = filter(mjml.children, { tagName: 'mj-raw' })

  const processing = (node, context, parseMJML = identity) => {
    if (!node) {
      return
    }

    const component = initComponent({
      name: node.tagName,
      initialDatas: {
        ...parseMJML(node),
        context,
      },
    })

    if (component !== null) {
      if ('handler' in component) {
        return component.handler() // eslint-disable-line consistent-return
      }

      if ('render' in component) {
        return component.render() // eslint-disable-line consistent-return
      }
    }
  }

  const applyAttributes = (mjml) => {
    const parse = (mjml, parentMjClass = '') => {
      const { attributes, tagName, children } = mjml
      const classes = get(mjml.attributes, 'mj-class', '').split(' ')
      const attributesClasses = reduce(
        classes,
        (acc, value) => {
          const mjClassValues = globalData.classes[value]
          let multipleClasses = {}
          if (acc['css-class'] && get(mjClassValues, 'css-class')) {
            multipleClasses = {
              'css-class': `${acc['css-class']} ${mjClassValues['css-class']}`,
            }
          }

          return {
            ...acc,
            ...mjClassValues,
            ...multipleClasses,
          }
        },
        {},
      )

      const defaultAttributesForClasses = reduce(
        parentMjClass.split(' '),
        (acc, value) => ({
          ...acc,
          ...get(globalData.classesDefault, `${value}.${tagName}`),
        }),
        {},
      )
      const nextParentMjClass = get(attributes, 'mj-class', parentMjClass)

      return {
        ...mjml,
        attributes: {
          ...globalData.defaultAttributes[tagName],
          ...attributesClasses,
          ...defaultAttributesForClasses,
          ...omit(attributes, ['mj-class']),
        },
        rawAttrs: { ...omit(attributes, ['mj-class']) },
        globalAttributes: {
          ...globalData.defaultAttributes['mj-all'],
        },
        children: map(children, (mjml) => parse(mjml, nextParentMjClass)),
      }
    }

    return parse(mjml)
  }

  const bodyHelpers = {
    components,
    globalData,
    addMediaQuery(className, { parsedWidth, unit }) {
      globalData.mediaQueries[className] =
        `{ width:${parsedWidth}${unit} !important; max-width: ${parsedWidth}${unit}; }`
    },
    addHeadStyle(identifier, headStyle) {
      globalData.headStyle[identifier] = headStyle
    },
    addComponentHeadSyle(headStyle) {
      globalData.componentsHeadStyle.push(headStyle)
    },
    getGlobalDatas: () => globalData,
    processing: (node, context) => processing(node, context, applyAttributes),
  }

  const headHelpers = {
    components,
    globalData,
    add(attr, ...params) {
      if (Array.isArray(globalData[attr])) {
        globalData[attr].push(...params)
      } else if (Object.prototype.hasOwnProperty.call(globalData, attr)) {
        if (params.length > 1) {
          if (isObject(globalData[attr][params[0]])) {
            globalData[attr][params[0]] = {
              ...globalData[attr][params[0]],
              ...params[1],
            }
          } else {
            // eslint-disable-next-line prefer-destructuring
            globalData[attr][params[0]] = params[1]
          }
        } else {
          // eslint-disable-next-line prefer-destructuring
          globalData[attr] = params[0]
        }
      } else {
        throw Error(
          `An mj-head element add an unkown head attribute : ${attr} with params ${
            Array.isArray(params) ? params.join('') : params
          }`,
        )
      }
    },
  }

  globalData.headRaw = processing(mjHead, headHelpers)

  content = processing(mjBody, bodyHelpers, applyAttributes)

  if (!content) {
    throw new Error(
      'Malformed MJML. Check that your structure is correct and enclosed in <mjml> tags.',
    )
  }

  content = minifyOutlookConditionnals(content)

  if (mjOutsideRaws.length) {
    const toAddBeforeDoctype = mjOutsideRaws.filter(
      (elt) =>
        elt.attributes.position && elt.attributes.position === 'file-start',
    )
    if (toAddBeforeDoctype.length) {
      globalData.beforeDoctype = toAddBeforeDoctype
        .map((elt) => elt.content)
        .join('\n')
    }
  }

  if (!isEmpty(globalData.htmlAttributes)) {
    const $ = load(content, {
      xmlMode: true, // otherwise it may move contents that aren't in any tag
      decodeEntities: false, // won't escape special characters
    })

    each(globalData.htmlAttributes, (data, selector) => {
      each(data, (value, attrName) => {
        $(selector).each(function getAttr() {
          $(this).attr(attrName, value || '')
        })
      })
    })

    content = $.root().html()
  }

  content = skeleton({
    content,
    ...globalData,
    printerSupport,
  })

  if (globalData.inlineStyle.length > 0) {
    if (juicePreserveTags) {
      each(juicePreserveTags, (val, key) => {
        juice.codeBlocks[key] = val
      })
    }

    content = juice(content, {
      applyStyleTags: false,
      extraCss: globalData.inlineStyle.join(''),
      insertPreservedExtraCss: false,
      removeStyleTags: false,
      ...juiceOptions,
    })
  }

  content = mergeOutlookConditionnals(content)

  // PostProcessors
  if (minify) {
    let normalizedMinifyOptions = minifyOptions
    if (
      minifyOptions &&
      typeof minifyOptions.minifyCss === 'undefined' &&
      typeof minifyOptions.minifyCSS !== 'undefined'
    ) {
      const mapped = minifyOptions.minifyCSS ? { preset: cssnanoLitePreset } : false
      const { minifyCSS, ...rest } = minifyOptions
      normalizedMinifyOptions = { ...rest, minifyCss: mapped }
    }

    const { minifyCss: userMinifyCss, ...minifyOptionsRest } =
      normalizedMinifyOptions || {}

    let resolvedUserMinifyCss
    if (typeof userMinifyCss !== 'undefined') {
      if (userMinifyCss.options) {
        resolvedUserMinifyCss = userMinifyCss.options
      } else {
        resolvedUserMinifyCss = userMinifyCss
      }
    } else {
      resolvedUserMinifyCss = undefined
    }

    resolvedUserMinifyCss = normalizeMinifyCssOption(resolvedUserMinifyCss)

    const htmlnanoOptions = {
      collapseWhitespace: true,
      minifyCss:
        typeof resolvedUserMinifyCss !== 'undefined'
          ? resolvedUserMinifyCss
          : { preset: cssnanoLitePreset },
      removeEmptyAttributes: true,
      minifyJs: false,
      removeComments: keepComments ? false : 'safe',
      ...minifyOptionsRest,
    }

    const syntaxes =
      templateSyntax || [
        { prefix: '{{', suffix: '}}' },
        { prefix: '[[', suffix: ']]' },
      ]

    const cssMinifyEnabled = htmlnanoOptions.minifyCss !== false

    // Protect content wrapped in <!-- htmlmin:ignore --> pairs from whitespace
    // collapsing. We extract each protected chunk into an opaque token so
    // htmlnano never sees the content, then restore it afterwards.
    const htmlminIgnoreList = []
    content = content.replace(
      /<!--\s*htmlmin:ignore\s*-->([\s\S]*?)<!--\s*htmlmin:ignore\s*-->/g,
      (_, inner) => {
        const token = `MJMLHTMLIGNORE${htmlminIgnoreList.length}END`
        htmlminIgnoreList.push(inner)
        return token
      },
    )

    const sanitizationResult = sanitizeTemplateVariablesInHtml(
      content,
      sanitizeStyles === true && cssMinifyEnabled,
      syntaxes,
      allowMixedSyntax,
      'CSS minification',
    )
    content = sanitizationResult.content

    content = await minifier.process(content, htmlnanoOptions).then((res) => res.html)

    if (sanitizationResult.didSanitize) {
      content = restoreTemplateVariablesInHtml(
        content,
        sanitizationResult.variableMap,
        sanitizationResult.propMap,
        sanitizationResult.isBlockVariable,
        syntaxes,
      )
    }

    // Restore the htmlmin:ignore-protected chunks
    if (htmlminIgnoreList.length > 0) {
      content = content.replace(
        /MJMLHTMLIGNORE(\d+)END/g,
        (_, i) => htmlminIgnoreList[parseInt(i, 10)],
      )
    }

  } else if (beautify) {
    
    // Strip <!-- htmlmin:ignore --> markers (they are only meaningful to the
    // minifier; in beautified output they are just noise).
    content = content.replace(/<!--\s*htmlmin:ignore\s*-->/g, '')

    const syntaxes =
      templateSyntax || [
        { prefix: '{{', suffix: '}}' },
        { prefix: '[[', suffix: ']]' },
      ]

    const sanitizationResult = sanitizeTemplateVariablesInHtml(
      content,
      sanitizeStyles === true,
      syntaxes,
      allowMixedSyntax,
      'beautification',
    )
    content = sanitizationResult.content

    if (isNode) {
      // Lazy-load Node-only formatter to avoid Biome WASM dependency in non-beautify paths
      const nodeFormatter = await import('./node-only/node-formatter')
      const formatHtml =
        nodeFormatter.formatHtml ||
        (nodeFormatter.default && nodeFormatter.default.formatHtml)
      content = formatHtml(content)
    } else {
      // eslint-disable-next-line global-require
      const prettierModule = require('prettier')
      // Prettier v3 standalone (browser) requires plugins to be passed explicitly.
      // eslint-disable-next-line global-require
      const prettierHtml = require('prettier/plugins/html')
      content = await prettierModule.format(content, {
        parser: 'html',
        printWidth: 240,
        plugins: [prettierHtml],
      })
    }

    if (sanitizationResult.didSanitize) {
      content = restoreTemplateVariablesInHtml(
        content,
        sanitizationResult.variableMap,
        sanitizationResult.propMap,
        sanitizationResult.isBlockVariable,
        syntaxes,
      )
    }
  }

  return {
    html: content,
    json: mjml,
    errors,
  }
}

if (isNode) {
  handleMjmlConfig(process.cwd(), registerComponent)
}

export {
  globalComponents as components,
  initComponent,
  registerComponent,
  assignComponents,
  makeLowerBreakpoint,
  suffixCssClasses,
  handleMjmlConfig,
  initializeType,
}

export { BodyComponent, HeadComponent } from './createComponent'
