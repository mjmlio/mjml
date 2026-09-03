export const MODIFIER_SEPARATOR = '--'
const EMITTED_STYLE_CONTENT_SET_KEY = 'modifierEmittedStyleContents'

function getModifierRules(globalData, rulesKey = 'modifierRules') {
  return Array.isArray(globalData && globalData[rulesKey])
    ? globalData[rulesKey]
    : []
}

export function getModifierDefinitions(globalData, defaultDefinitions = {}) {
  if (!globalData) {
    return { ...defaultDefinitions }
  }

  if (
    !globalData.modifierDefinitions ||
    typeof globalData.modifierDefinitions !== 'object'
  ) {
    globalData.modifierDefinitions = { ...defaultDefinitions }
    return globalData.modifierDefinitions
  }

  Object.entries(defaultDefinitions).forEach(([modifier, definition]) => {
    const existingDefinition = globalData.modifierDefinitions[modifier]

    if (!existingDefinition || typeof existingDefinition !== 'object') {
      globalData.modifierDefinitions[modifier] = { ...definition }
      return
    }

    globalData.modifierDefinitions[modifier] = {
      ...definition,
      ...existingDefinition,
    }
  })

  return globalData.modifierDefinitions
}

export function normalizeModifierKeyword(modifier) {
  return String(modifier || '').trim().toLowerCase()
}

function getClassPrefixForModifier(definition = {}) {
  return `mj-${definition.classNamespace || 'modifier'}`
}

export function formatGroupedRules(rules, selectorPrefix = '') {
  const declarationGroups = new Map()

  rules.forEach(({ className, selector, cssProperty, cssValue, selectorSuffix }) => {
    const declaration = `${cssProperty}: ${cssValue} !important;`
    const selectorSuffixes = Array.isArray(selectorSuffix)
      ? selectorSuffix
      : [selectorSuffix || '']

    if (!declarationGroups.has(declaration)) {
      declarationGroups.set(declaration, new Set())
    }

    if (selector) {
      declarationGroups.get(declaration).add(`${selectorPrefix}${selector}`)
    } else {
      selectorSuffixes.forEach((suffix) => {
        declarationGroups.get(declaration).add(`${selectorPrefix}.${className}${suffix}`)
      })
    }
  })

  const selectorGroups = new Map()

  declarationGroups.forEach((selectorsSet, declaration) => {
    const selectors = Array.from(selectorsSet)
    const selectorsKey = selectors.join('\u0000')

    if (!selectorGroups.has(selectorsKey)) {
      selectorGroups.set(selectorsKey, {
        selectors,
        declarations: [],
      })
    }

    selectorGroups.get(selectorsKey).declarations.push(declaration)
  })

  return Array.from(selectorGroups.values())
    .map(({ selectors, declarations }) => {
      const selectorList = selectors.join(',\n  ')
      const declarationList = declarations.join(' ')
      return `  ${selectorList} { ${declarationList} }`
    })
    .join('\n')
}

export function registerModifier(
  globalData,
  definition = {},
  { defaultDefinitions = {} } = {},
) {
  const modifier = normalizeModifierKeyword(definition.modifier)

  if (!globalData || !modifier) {
    return null
  }

  const definitions = getModifierDefinitions(globalData, defaultDefinitions)
  const existing = definitions[modifier] || {}

  definitions[modifier] = {
    ...existing,
    ...(definition.mediaQuery
      ? { mediaQuery: definition.mediaQuery }
      : {}),
    ...(definition.classNamespace
      ? { classNamespace: definition.classNamespace }
      : {}),
    ...(Object.prototype.hasOwnProperty.call(definition, 'outlookSelectorPrefix')
      ? { outlookSelectorPrefix: definition.outlookSelectorPrefix }
      : {}),
  }

  if (!definitions[modifier].classNamespace) {
    definitions[modifier].classNamespace = modifier
  }

  return definitions[modifier]
}

export function registerModifierRule(
  globalData,
  {
    modifier,
    cssProperty,
    cssValue,
    selectorSuffix,
    selector,
    supportModifierSelector = false,
    mediaQuery,
    classNamespace,
    outlookSelectorPrefix,
  },
  {
    defaultDefinitions = {},
    rulesKey = 'modifierRules',
    counterByModifierKey = 'modifierRuleCountByModifier',
    getClassName,
  } = {},
) {
  const modifierKeyword = normalizeModifierKeyword(modifier)

  if (!globalData || !cssValue || !cssProperty || !modifierKeyword) {
    return null
  }

  const modifierDefinition = registerModifier(
    globalData,
    {
      modifier: modifierKeyword,
      mediaQuery,
      classNamespace,
      outlookSelectorPrefix,
    },
    { defaultDefinitions },
  )

  let className = null

  // An explicit selector (e.g. a :hover/:checked chain) targets markup
  // directly, so no generated class name is needed.
  if (!selector) {
    if (typeof getClassName === 'function') {
      className = getClassName(globalData, modifierKeyword, modifierDefinition)
    } else {
      if (
        !globalData[counterByModifierKey] ||
        typeof globalData[counterByModifierKey] !== 'object'
      ) {
        globalData[counterByModifierKey] = {}
      }

      if (typeof globalData[counterByModifierKey][modifierKeyword] !== 'number') {
        globalData[counterByModifierKey][modifierKeyword] = 0
      }

      globalData[counterByModifierKey][modifierKeyword] += 1

      const classPrefix = getClassPrefixForModifier(modifierDefinition)
      className = `${classPrefix}-${globalData[counterByModifierKey][modifierKeyword]}`
    }
  }

  if (!Array.isArray(globalData[rulesKey])) {
    globalData[rulesKey] = []
  }

  globalData[rulesKey].push({
    modifier: modifierKeyword,
    className,
    selector,
    cssProperty,
    cssValue,
    selectorSuffix,
    supportModifierSelector: Boolean(supportModifierSelector),
  })

  return selector || className
}

export function registerModifierRuleGroup(
  globalData,
  {
    modifier,
    cssDeclarations,
    selectorSuffix,
    selector,
    supportModifierSelector = false,
    mediaQuery,
    classNamespace,
    outlookSelectorPrefix,
  },
  options = {},
) {
  const validDeclarations = Array.isArray(cssDeclarations)
    ? cssDeclarations.filter(({ cssProperty, cssValue }) => Boolean(cssProperty && cssValue))
    : []

  if (!globalData || validDeclarations.length === 0) {
    return null
  }

  const className = registerModifierRule(
    globalData,
    {
      modifier,
      cssProperty: validDeclarations[0].cssProperty,
      cssValue: validDeclarations[0].cssValue,
      selectorSuffix: Object.prototype.hasOwnProperty.call(validDeclarations[0], 'selectorSuffix')
        ? validDeclarations[0].selectorSuffix
        : selectorSuffix,
      selector,
      supportModifierSelector,
      mediaQuery,
      classNamespace,
      outlookSelectorPrefix,
    },
    options,
  )

  if (!className || validDeclarations.length === 1) {
    return className
  }

  const {
    rulesKey = 'modifierRules',
  } = options

  if (!Array.isArray(globalData[rulesKey])) {
    globalData[rulesKey] = []
  }

  validDeclarations.slice(1).forEach((declaration) => {
    globalData[rulesKey].push({
      modifier: normalizeModifierKeyword(modifier),
      className,
      cssProperty: declaration.cssProperty,
      cssValue: declaration.cssValue,
      selectorSuffix: Object.prototype.hasOwnProperty.call(declaration, 'selectorSuffix')
        ? declaration.selectorSuffix
        : selectorSuffix,
      selector,
      supportModifierSelector: Boolean(supportModifierSelector),
    })
  })

  return className
}

export function buildModifierStyleBlocks(rules, definitions) {
  const modifierRulesMap = new Map()

  rules.forEach((rule) => {
    const modifier = normalizeModifierKeyword(rule.modifier)

    if (!modifier) {
      return
    }

    if (!modifierRulesMap.has(modifier)) {
      modifierRulesMap.set(modifier, [])
    }

    modifierRulesMap.get(modifier).push(rule)
  })

  const styleBlocks = []

  modifierRulesMap.forEach((modifierRules, modifier) => {
    const definition = definitions[modifier] || {}

    if (!definition.mediaQuery) {
      return
    }

    const cssRules = formatGroupedRules(modifierRules)

    if (cssRules) {
      styleBlocks.push(`@media ${definition.mediaQuery} {\n${cssRules}\n}`)
    }

    if (!definition.outlookSelectorPrefix) {
      return
    }

    const outlookRules = formatGroupedRules(
      modifierRules.filter(({ supportModifierSelector }) => supportModifierSelector),
      definition.outlookSelectorPrefix,
    )

    if (outlookRules) {
      styleBlocks.push(outlookRules)
    }
  })

  return styleBlocks
}

export function emitModifierHeadStyle(
  globalData,
  {
    defaultDefinitions = {},
    rules,
    rulesKey = 'modifierRules',
    emittedFlag = 'modifierStyleEmitted',
  } = {},
) {
  if (!globalData) {
    return false
  }

  const modifierRules = Array.isArray(rules)
    ? rules
    : getModifierRules(globalData, rulesKey)

  if (modifierRules.length === 0) {
    return false
  }

  const definitions = getModifierDefinitions(globalData, defaultDefinitions)
  const styleBlocks = buildModifierStyleBlocks(modifierRules, definitions)

  if (styleBlocks.length === 0) {
    return false
  }

  const styleTag = `<style>\n${styleBlocks.join('\n')}\n</style>`

  if (!(globalData[EMITTED_STYLE_CONTENT_SET_KEY] instanceof Set)) {
    globalData[EMITTED_STYLE_CONTENT_SET_KEY] = new Set()
  }

  if (globalData[EMITTED_STYLE_CONTENT_SET_KEY].has(styleTag)) {
    return false
  }

  globalData[EMITTED_STYLE_CONTENT_SET_KEY].add(styleTag)

  if (emittedFlag) {
    globalData[emittedFlag] = true
  }

  globalData.headRaw = Array.isArray(globalData.headRaw)
    ? globalData.headRaw
    : []

  globalData.headRaw.push(styleTag)

  return true
}