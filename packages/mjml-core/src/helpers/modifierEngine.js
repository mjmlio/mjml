export const MODIFIER_SEPARATOR = '--'
const EMITTED_STYLE_CONTENT_SET_KEY = 'modifierEmittedStyleContents'
const MODIFIER_STYLE_REVISION_KEY = 'modifierStyleRevision'
const MODIFIER_STYLE_EMISSION_REVISIONS_KEY = 'modifierStyleEmissionRevisions'
const MODIFIER_SHORTHANDS = new Map([
  ['padding', ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']],
  ['border-color', ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color']],
  ['background-position', ['background-position-x', 'background-position-y']],
  ['margin', ['margin-top']],
])
const MODIFIER_PROPERTIES = new Set([
  ...MODIFIER_SHORTHANDS.keys(),
  ...Array.from(MODIFIER_SHORTHANDS.values()).flat(),
  'background-color', 'background-image', 'background-repeat', 'background-size',
  'color', 'direction', 'display', 'font-size', 'height', 'line-height',
  'max-height', 'min-height', 'min-width', 'text-align', 'width',
])

function markModifierStyleDirty(globalData) {
  globalData[MODIFIER_STYLE_REVISION_KEY] =
    (globalData[MODIFIER_STYLE_REVISION_KEY] || 0) + 1
}

function sameShallowValues(first = {}, second = {}) {
  const keys = new Set([...Object.keys(first), ...Object.keys(second)])

  return Array.from(keys).every((key) => first[key] === second[key])
}

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
    markModifierStyleDirty(globalData)
    return globalData.modifierDefinitions
  }

  let changed = false
  Object.entries(defaultDefinitions).forEach(([modifier, definition]) => {
    const existingDefinition = globalData.modifierDefinitions[modifier]

    if (!existingDefinition || typeof existingDefinition !== 'object') {
      globalData.modifierDefinitions[modifier] = { ...definition }
      changed = true
      return
    }

    const mergedDefinition = {
      ...definition,
      ...existingDefinition,
    }
    if (!sameShallowValues(existingDefinition, mergedDefinition)) {
      changed = true
    }
    globalData.modifierDefinitions[modifier] = mergedDefinition
  })

  if (changed) markModifierStyleDirty(globalData)

  return globalData.modifierDefinitions
}

export function normalizeModifierKeyword(modifier) {
  return String(modifier || '').trim().toLowerCase()
}

function getClassPrefixForModifier(definition = {}) {
  return `mj-${definition.classNamespace || 'modifier'}`
}

function propertiesConflict(first, second) {
  // Only model properties emitted by built-in modifiers. Custom properties
  // remain supported, but cannot be assumed independent of other declarations.
  if (!MODIFIER_PROPERTIES.has(first) || !MODIFIER_PROPERTIES.has(second)) return true
  return first === second ||
    (MODIFIER_SHORTHANDS.get(first) || []).includes(second) ||
    (MODIFIER_SHORTHANDS.get(second) || []).includes(first)
}

export function registerModifierClassTargets(globalData, classNames) {
  if (!globalData || !classNames) return
  const classes = String(classNames).trim()
  if (!classes) return
  if (!globalData.modifierClassTargets) globalData.modifierClassTargets = new Map()
  const target = {}
  classes.split(/\s+/).forEach((className) => {
    if (!globalData.modifierClassTargets.has(className)) {
      globalData.modifierClassTargets.set(className, new Set())
    }
    globalData.modifierClassTargets.get(className).add(target)
  })
  markModifierStyleDirty(globalData)
}

function appendModifierRule(globalData, rulesKey, rule) {
  if (!Array.isArray(globalData[rulesKey])) {
    globalData[rulesKey] = []
  }

  globalData[rulesKey].push(rule)
  markModifierStyleDirty(globalData)
}

function selectorsMayOverlap(first, second, selectorTargets, classTargets) {
  const firstTarget = selectorTargets.get(first)
  const secondTarget = selectorTargets.get(second)
  // Explicit selectors, descendant suffixes and unrecorded classes are
  // ambiguous without a DOM. Keep their conflicting declarations ordered.
  if (!classTargets || !firstTarget || !secondTarget ||
    firstTarget.suffix || secondTarget.suffix) return true
  const firstElements = classTargets.get(firstTarget.className)
  const secondElements = classTargets.get(secondTarget.className)
  if (!firstElements || !secondElements) return true
  return Array.from(firstElements).some((target) => secondElements.has(target))
}

function getGroupDependencies(groups, selectorTargets, classTargets) {
  const dependencies = groups.map(() => new Set())

  groups.forEach((first, firstIndex) => {
    groups.slice(firstIndex + 1).forEach((second, offset) => {
      if (
        first.declaration === second.declaration ||
        !propertiesConflict(first.property, second.property)
      ) return

      const secondIndex = firstIndex + offset + 1
      // Selectors may match the same element. For each possible pair, retain
      // the last occurrence of each declaration on either matching selector.
      first.selectors.forEach((firstPosition, firstSelector) => {
        second.selectors.forEach((secondPosition, secondSelector) => {
          if (!selectorsMayOverlap(firstSelector, secondSelector, selectorTargets, classTargets)) return
          const firstLast = Math.max(firstPosition, first.selectors.get(secondSelector) ?? -1)
          const secondLast = Math.max(secondPosition, second.selectors.get(firstSelector) ?? -1)
          if (firstLast < secondLast) dependencies[secondIndex].add(firstIndex)
          if (secondLast < firstLast) dependencies[firstIndex].add(secondIndex)
        })
      })
    })
  })

  return dependencies
}

function orderDeclarationGroups(groups, selectorTargets, classTargets) {
  const dependencies = getGroupDependencies(groups, selectorTargets, classTargets)
  const pending = new Set(groups.map((group, index) => index))
  const ordered = []
  let previousSelectorsKey

  while (pending.size > 0) {
    const ready = Array.from(pending).filter((index) =>
      Array.from(dependencies[index]).every((dependency) => !pending.has(dependency)))
    if (ready.length === 0) break
    const selectorsKey = previousSelectorsKey
    const next = ready.find((index) => groups[index].selectorsKey === selectorsKey) ?? ready[0]
    ordered.push(groups[next])
    previousSelectorsKey = groups[next].selectorsKey
    pending.delete(next)
  }

  return { ordered, pending, dependencies }
}

function isInDependencyCycle(index, dependencies, pending) {
  const visited = new Set()
  const stack = Array.from(dependencies[index])
  while (stack.length > 0) {
    const next = stack.pop()
    if (next === index) return true
    if (pending.has(next) && !visited.has(next)) {
      visited.add(next)
      stack.push(...dependencies[next])
    }
  }
  return false
}

function makeDeclarationGroup(declaration, property, selectors) {
  return {
    declaration,
    property,
    selectors,
    selectorsKey: Array.from(selectors.keys()).sort().join('\u0000'),
  }
}

export function formatGroupedRules(rules, selectorPrefix = '', classTargets) {
  const declarationGroups = new Map()
  const selectorTargets = new Map()
  rules.forEach(({ className, selector, cssProperty, cssValue, selectorSuffix }, index) => {
    const declaration = `${cssProperty}: ${cssValue} !important;`
    const selectorSuffixes = Array.isArray(selectorSuffix)
      ? selectorSuffix
      : [selectorSuffix || '']
    const selectors = selector
      ? [`${selectorPrefix}${selector}`]
      : selectorSuffixes.map((suffix) => `${selectorPrefix}.${className}${suffix}`)

    if (selectors.length === 0) return
    if (!declarationGroups.has(declaration)) {
      declarationGroups.set(declaration, {
        property: cssProperty.toLowerCase(),
        selectors: new Map(),
      })
    }
    // Earlier identical declarations for the same selector are redundant.
    selectors.forEach((value, suffixIndex) => {
      declarationGroups.get(declaration).selectors.set(value, index)
      if (selector || !selectorTargets.has(value)) {
        selectorTargets.set(value, selector ? null : {
          className,
          suffix: selectorSuffixes[suffixIndex],
        })
      }
    })
  })

  const groups = Array.from(declarationGroups, ([declaration, { property, selectors }]) =>
    makeDeclarationGroup(declaration, property, selectors))
  let result = orderDeclarationGroups(groups, selectorTargets, classTargets)

  while (result.pending.size > 0) {
    const { pending, dependencies } = result
    const candidates = Array.from(pending).filter((index) =>
      groups[index].selectors.size > 1 &&
      isInDependencyCycle(index, dependencies, pending))
    if (candidates.length === 0) {
      throw new Error('Unable to preserve modifier CSS declaration order')
    }
    const splitIndex = candidates.reduce((best, index) =>
      groups[index].selectors.size > groups[best].selectors.size ? index : best)
    const group = groups[splitIndex]
    const entries = Array.from(group.selectors).sort((a, b) => a[1] - b[1])
    const middle = Math.ceil(entries.length / 2)
    // Contradictory ordering needs separate selector groups, not a global
    // fallback to individual rules. Only split a group participating in a cycle.
    groups.splice(splitIndex, 1,
      makeDeclarationGroup(group.declaration, group.property, new Map(entries.slice(0, middle))),
      makeDeclarationGroup(group.declaration, group.property, new Map(entries.slice(middle))))
    result = orderDeclarationGroups(groups, selectorTargets, classTargets)
  }

  const combined = []
  result.ordered.forEach((group) => {
    const previous = combined[combined.length - 1]
    if (previous && previous.selectorsKey === group.selectorsKey) {
      previous.declarations.push(group.declaration)
    } else {
      combined.push({
        selectorsKey: group.selectorsKey,
        selectors: Array.from(group.selectors.keys()),
        declarations: [group.declaration],
      })
    }
  })

  return combined
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

  const updatedDefinition = {
    ...existing,
    ...(definition.mediaQuery
      ? { mediaQuery: definition.mediaQuery }
      : {}),
    ...(definition.classNamespace
      ? { classNamespace: definition.classNamespace }
      : {}),
    ...(definition.outlookSelectorPrefix !== undefined
      ? { outlookSelectorPrefix: definition.outlookSelectorPrefix }
      : {}),
  }

  if (!updatedDefinition.classNamespace) {
    updatedDefinition.classNamespace = modifier
  }

  if (!sameShallowValues(existing, updatedDefinition)) {
    markModifierStyleDirty(globalData)
  }
  definitions[modifier] = updatedDefinition

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

  appendModifierRule(globalData, rulesKey, {
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

  validDeclarations.slice(1).forEach((declaration) => {
    appendModifierRule(globalData, rulesKey, {
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

export function buildModifierStyleBlocks(rules, definitions, classTargets) {
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

    const cssRules = formatGroupedRules(modifierRules, '', classTargets)

    if (cssRules) {
      styleBlocks.push(`@media ${definition.mediaQuery} {\n${cssRules}\n}`)
    }

    if (!definition.outlookSelectorPrefix) {
      return
    }

    const outlookRules = formatGroupedRules(
      modifierRules.filter(({ supportModifierSelector }) => supportModifierSelector),
      definition.outlookSelectorPrefix,
      classTargets,
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
    cacheKey,
  } = {},
) {
  if (!globalData) {
    return false
  }

  let emissionRevisions
  if (cacheKey) {
    if (!(globalData[MODIFIER_STYLE_EMISSION_REVISIONS_KEY] instanceof Map)) {
      globalData[MODIFIER_STYLE_EMISSION_REVISIONS_KEY] = new Map()
    }
    emissionRevisions = globalData[MODIFIER_STYLE_EMISSION_REVISIONS_KEY]
    if (
      emissionRevisions.get(cacheKey) ===
      (globalData[MODIFIER_STYLE_REVISION_KEY] || 0)
    ) {
      return false
    }
  }

  const cacheRevision = () => {
    if (emissionRevisions) {
      emissionRevisions.set(
        cacheKey,
        globalData[MODIFIER_STYLE_REVISION_KEY] || 0,
      )
    }
  }

  const modifierRules = Array.isArray(rules)
    ? rules
    : getModifierRules(globalData, rulesKey)

  if (modifierRules.length === 0) {
    cacheRevision()
    return false
  }

  const definitions = getModifierDefinitions(globalData, defaultDefinitions)
  const styleBlocks = buildModifierStyleBlocks(
    modifierRules,
    definitions,
    globalData.modifierUseClassTargets ? globalData.modifierClassTargets : undefined,
  )

  if (styleBlocks.length === 0) {
    cacheRevision()
    return false
  }

  const styleTag = `<style>\n${styleBlocks.join('\n')}\n</style>`

  if (!(globalData[EMITTED_STYLE_CONTENT_SET_KEY] instanceof Set)) {
    globalData[EMITTED_STYLE_CONTENT_SET_KEY] = new Set()
  }

  if (globalData[EMITTED_STYLE_CONTENT_SET_KEY].has(styleTag)) {
    cacheRevision()
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
  cacheRevision()

  return true
}
