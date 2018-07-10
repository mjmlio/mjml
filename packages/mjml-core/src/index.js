import { find, get, identity, map, omit, reduce, isObject } from 'lodash'
import path from 'path'
import fs from 'fs'
import juice from 'juice'
import { html as htmlBeautify } from 'js-beautify'
import { minify as htmlMinify } from 'html-minifier'

import MJMLParser from 'mjml-parser-xml'
import MJMLValidator from 'mjml-validator'
import { handleMjml3 } from 'mjml-migrate'

import components, { initComponent, registerComponent } from './components'

import suffixCssClasses from './helpers/suffixCssClasses'
import mergeOutlookConditionnals from './helpers/mergeOutlookConditionnals'
import minifyOutlookConditionnals from './helpers/minifyOutlookConditionnals'
import defaultSkeleton from './helpers/skeleton'

class ValidationError extends Error {
  constructor(message, errors) {
    super(message)

    this.errors = errors
  }
}

export default function mjml2html(mjml, options = {}) {
  let content = ''
  let errors = []

  if (typeof options.skeleton === 'string') {
    /* eslint-disable global-require */
    /* eslint-disable import/no-dynamic-require */
    options.skeleton = require(options.skeleton.charAt(0) === '.'
      ? path.resolve(process.cwd(), options.skeleton)
      : options.skeleton)
    /* eslint-enable global-require */
    /* eslint-enable import/no-dynamic-require */
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
    keepComments,
    minify = false,
    skeleton = defaultSkeleton,
    validationLevel = 'soft',
    filePath = '.',
  } = options

  if (typeof mjml === 'string') {
    mjml = MJMLParser(mjml, {
      keepComments,
      components,
      filePath,
    })
  }

  mjml = handleMjml3(mjml)

  const globalDatas = {
    backgroundColor: '',
    breakpoint: '480px',
    classes: {},
    classesDefault: {},
    defaultAttributes: {},
    fonts,
    inlineStyle: [],
    headStyle: {},
    componentsHeadStyle: [],
    mediaQueries: {},
    preview: '',
    style: [],
    title: '',
    forceOWADesktop: get(mjml, 'attributes.owa', 'mobile') === 'desktop',
    lang: get(mjml, 'attributes.lang'),
  }

  const validatorOptions = {
    components,
  }

  switch (validationLevel) {
    case 'skip':
      break

    case 'strict':
      errors = MJMLValidator(mjml, validatorOptions)

      if (errors.length > 0) {
        throw new ValidationError(
          `ValidationError: \n ${errors
            .map(e => e.formattedMessage)
            .join('\n')}`,
          errors,
        )
      }
      break

    case 'soft':
    default:
    console.log('mjml ------------------------------------------>')
    console.log(mjml)
      errors = MJMLValidator(mjml, validatorOptions)
      break
  }

  const mjBody = find(mjml.children, { tagName: 'mj-body' })
  const mjHead = find(mjml.children, { tagName: 'mj-head' })

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
        component.handler()
      }

      if ('render' in component) {
        return component.render() // eslint-disable-line consistent-return
      }
    }
  }

  const applyAttributes = mjml => {
    const parse = (mjml, parentMjClass = '') => {
      const { attributes, tagName, children } = mjml
      const classes = get(mjml.attributes, 'mj-class', '').split(' ')
      const attributesClasses = reduce(
        classes,
        (acc, value) => {
          const mjClassValues = globalDatas.classes[value]
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
          ...get(globalDatas.classesDefault, `${value}.${tagName}`),
        }),
        {},
      )
      const nextParentMjClass = get(attributes, 'mj-class', parentMjClass)

      return {
        ...mjml,
        attributes: {
          ...globalDatas.defaultAttributes['mj-all'],
          ...globalDatas.defaultAttributes[tagName],
          ...attributesClasses,
          ...defaultAttributesForClasses,
          ...omit(attributes, ['mj-class']),
        },
        children: map(children, mjml => parse(mjml, nextParentMjClass)),
      }
    }

    return parse(mjml)
  }

  const bodyHelpers = {
    addMediaQuery(className, { parsedWidth, unit }) {
      globalDatas.mediaQueries[
        className
      ] = `{ width:${parsedWidth}${unit} !important; max-width: ${parsedWidth}${unit}; }`
    },
    addHeadSyle(identifier, headStyle) {
      globalDatas.headStyle[identifier] = headStyle
    },
    addComponentHeadSyle(headStyle) {
      globalDatas.componentsHeadStyle.push(headStyle)
    },
    setBackgroundColor: color => {
      globalDatas.backgroundColor = color
    },
    processing: (node, context) => processing(node, context, applyAttributes),
  }

  const headHelpers = {
    add(attr, ...params) {
      if (Array.isArray(globalDatas[attr])) {
        globalDatas[attr].push(...params)
      } else if (Object.prototype.hasOwnProperty.call(globalDatas, attr)) {
        if (params.length > 1) {
          if (isObject(globalDatas[attr][params[0]])) {
            globalDatas[attr][params[0]] = {
              ...globalDatas[attr][params[0]],
              ...params[1],
            }
          } else {
            globalDatas[attr][params[0]] = params[1]
          }
        } else {
          globalDatas[attr] = params[0]
        }
      } else {
        throw Error(
          `An mj-head element add an unkown head attribute : ${attr} with params ${Array.isArray(
            params,
          )
            ? params.join('')
            : params}`,
        )
      }
    },
  }

  processing(mjHead, headHelpers)

  content = processing(mjBody, bodyHelpers, applyAttributes)

  if (minify && minify !== 'false') {
    content = minifyOutlookConditionnals(content)
  }

  content = skeleton({
    content,
    ...globalDatas,
  })

  if (globalDatas.inlineStyle.length > 0) {
    content = juice(content, {
      applyStyleTags: false,
      extraCss: globalDatas.inlineStyle.join(''),
      insertPreservedExtraCss: false,
      removeStyleTags: false,
    })
  }

  content =
    beautify && beautify !== 'false'
      ? htmlBeautify(content, {
          indent_size: 2,
          wrap_attributes_indent_size: 2,
          max_preserve_newline: 0,
          preserve_newlines: false,
        })
      : content

  if (minify && minify !== 'false') {
    content = htmlMinify(content, {
      collapseWhitespace: true,
      minifyCSS: false,
      removeEmptyAttributes: true,
    })
  }

  content = mergeOutlookConditionnals(content)

  return {
    html: content,
    errors,
  }
}

// register components from mjmlconfig
try {
  const mjmlConfig = fs.readFileSync(path.join(process.cwd(), '.mjmlconfig'))
  const customComps = JSON.parse(mjmlConfig).packages

  customComps.forEach(compPath => {
    const requiredComp = require(path.join(process.cwd(), compPath)) // eslint-disable-line global-require, import/no-dynamic-require
    registerComponent(requiredComp.default || requiredComp)
  })
} catch (e) {
  if (e.code !== 'ENOENT') {
    console.log('Error when registering custom components : ', e) // eslint-disable-line no-console
  }
}

export { components, initComponent, registerComponent, suffixCssClasses }

export { BodyComponent, HeadComponent } from './createComponent'
