import {
  emitModifierHeadStyle as emitGenericModifierHeadStyle,
  registerModifier as registerGenericModifier,
  registerModifierRuleGroup as registerGenericModifierRuleGroup,
  registerModifierRule as registerGenericModifierRule,
} from './modifierEngine'

export const RESPONSIVE_CLASS_PREFIX = 'mj-responsive'

const DEFAULT_MODIFIER_DEFINITIONS = {
  responsive: {
    mediaQuery: 'only screen and (max-width:479px)',
    classNamespace: 'responsive',
  },
}

function getResponsiveRules(globalData) {
  return Array.isArray(globalData && globalData.responsiveRules)
    ? globalData.responsiveRules
    : []
}

function getModifierRules(globalData) {
  return Array.isArray(globalData && globalData.modifierRules)
    ? globalData.modifierRules
    : []
}

export function registerModifier(globalData, definition = {}) {
  return registerGenericModifier(globalData, definition, {
    defaultDefinitions: DEFAULT_MODIFIER_DEFINITIONS,
  })
}

export function registerModifierRule(globalData, options = {}) {
  return registerGenericModifierRule(globalData, options, {
    defaultDefinitions: DEFAULT_MODIFIER_DEFINITIONS,
  })
}

/**
 * Registers a CSS property/value pair for responsive mode.
 * Returns a unique CSS class name (e.g. "mj-responsive-1") which should be applied
 * to the element in the rendered HTML so the rule targets it.
 */
export function registerResponsiveRule(globalData, { cssProperty, cssValue, selectorSuffix }) {
  return registerGenericModifierRuleGroup(globalData, {
    modifier: 'responsive',
    cssDeclarations: [{ cssProperty, cssValue }],
    selectorSuffix,
  }, {
    defaultDefinitions: DEFAULT_MODIFIER_DEFINITIONS,
    rulesKey: 'responsiveRules',
    getClassName(data) {
      if (typeof data.responsiveRuleCount !== 'number') {
        data.responsiveRuleCount = 0
      }

      data.responsiveRuleCount += 1

      return `${RESPONSIVE_CLASS_PREFIX}-${data.responsiveRuleCount}`
    },
  })
}

/**
 * Registers multiple CSS declarations under one responsive class name.
 */
export function registerResponsiveRuleGroup(globalData, { cssDeclarations, selectorSuffix }) {
  return registerGenericModifierRuleGroup(globalData, {
    modifier: 'responsive',
    cssDeclarations,
    selectorSuffix,
  }, {
    defaultDefinitions: DEFAULT_MODIFIER_DEFINITIONS,
    rulesKey: 'responsiveRules',
    getClassName(data) {
      if (typeof data.responsiveRuleCount !== 'number') {
        data.responsiveRuleCount = 0
      }

      data.responsiveRuleCount += 1

      return `${RESPONSIVE_CLASS_PREFIX}-${data.responsiveRuleCount}`
    },
  })
}

/**
 * Emits the responsive modifier style block to globalData.headRaw.
 * Returns true if the block was emitted, false otherwise.
 */
export function emitModifierHeadStyle(globalData) {
  const rules = [
    ...getResponsiveRules(globalData).map((rule) => ({
      ...rule,
      modifier: 'responsive',
    })),
    ...getModifierRules(globalData),
  ]
  const emitted = emitGenericModifierHeadStyle(globalData, {
    defaultDefinitions: DEFAULT_MODIFIER_DEFINITIONS,
    rules,
    emittedFlag: 'responsiveStyleEmitted',
  })

  return emitted
}

export function emitResponsiveHeadStyle(globalData) {
  return emitModifierHeadStyle(globalData)
}

/**
 * Converts [cssProperty, cssValue] pairs into cssDeclarations objects,
 * filtering out any pairs where cssValue is falsy.
 */
export function buildResponsiveDeclarations(pairs) {
  return pairs
    .filter(([, cssValue]) => Boolean(cssValue))
    .map(([cssProperty, cssValue]) => ({ cssProperty, cssValue }))
}

/**
 * Registers the standard container padding responsive group from a component's
 * attributes object. Handles padding, padding-top/right/bottom/left.
 * Returns the class name, or null if no responsive padding attributes are set.
 * Safe to call on any component — missing attributes are filtered out.
 */
export function registerResponsivePaddingGroup(globalData, attributes) {
  return registerResponsiveRuleGroup(globalData, {
    cssDeclarations: buildResponsiveDeclarations([
      ['padding', attributes['padding--responsive']],
      ['padding-top', attributes['padding-top--responsive']],
      ['padding-right', attributes['padding-right--responsive']],
      ['padding-bottom', attributes['padding-bottom--responsive']],
      ['padding-left', attributes['padding-left--responsive']],
    ]),
  })
}

/**
 * Registers the standard background responsive group from a component's
 * attributes object. Covers background-position/x/y, background-repeat,
 * background-size. Note: background-url requires url() wrapping and must be
 * handled per-component.
 * Safe to call on any component — missing attributes are filtered out.
 */
export function registerResponsiveBackgroundGroup(globalData, attributes) {
  return registerResponsiveRuleGroup(globalData, {
    cssDeclarations: buildResponsiveDeclarations([
      ['background-position', attributes['background-position--responsive']],
      ['background-position-x', attributes['background-position-x--responsive']],
      ['background-position-y', attributes['background-position-y--responsive']],
      ['background-repeat', attributes['background-repeat--responsive']],
      ['background-size', attributes['background-size--responsive']],
    ]),
  })
}