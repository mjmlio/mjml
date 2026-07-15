import {
  emitModifierHeadStyle as emitGenericModifierHeadStyle,
  registerModifier as registerGenericModifier,
  registerModifierRuleGroup as registerGenericModifierRuleGroup,
  registerModifierRule as registerGenericModifierRule,
} from './modifierEngine'

export const DARK_MODE_CLASS_PREFIX = 'mj-dark'

const DEFAULT_MODIFIER_DEFINITIONS = {
  dark: {
    mediaQuery: '(prefers-color-scheme: dark)',
    classNamespace: 'dark',
    outlookSelectorPrefix: '[data-ogsb] ',
  },
}

function getDarkModeRules(globalData) {
  return Array.isArray(globalData && globalData.darkModeRules)
    ? globalData.darkModeRules
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
 * Registers a CSS property/value pair for prefers-color-scheme dark mode.
 * Returns a unique CSS class name (e.g. "mj-dark-1") which should be applied
 * to the element in the rendered HTML so the rule targets it.
 *
 * Call this during a component's render() to ensure the class name is available
 * before the element HTML is constructed.
 */
export function registerDarkModeRule(
  globalData,
  { cssProperty, cssValue, supportOutlookDarkMode = false },
) {
  return registerGenericModifierRuleGroup(globalData, {
    modifier: 'dark',
    cssDeclarations: [{ cssProperty, cssValue }],
    supportModifierSelector: supportOutlookDarkMode,
  }, {
    defaultDefinitions: DEFAULT_MODIFIER_DEFINITIONS,
    rulesKey: 'darkModeRules',
    getClassName(data) {
      if (typeof data.darkModeRuleCount !== 'number') {
        data.darkModeRuleCount = 0
      }

      data.darkModeRuleCount += 1

      return `${DARK_MODE_CLASS_PREFIX}-${data.darkModeRuleCount}`
    },
  })
}

/**
 * Pushes the combined @media (prefers-color-scheme: dark) style block to
 * globalData.headRaw. This should be called from a component's
 * componentHeadStyle function (which runs during skeleton assembly, after all
 * body components have rendered and registered their rules).
 *
 * Only emits once — subsequent calls are no-ops because all rules are already
 * accumulated by the time the first call is made.
 *
 * Returns true if the block was emitted, false otherwise.
 */
export function emitModifierHeadStyle(globalData) {
  const rules = [
    ...getDarkModeRules(globalData).map((rule) => ({
      ...rule,
      modifier: 'dark',
    })),
    ...getModifierRules(globalData),
  ]
  const emitted = emitGenericModifierHeadStyle(globalData, {
    defaultDefinitions: DEFAULT_MODIFIER_DEFINITIONS,
    rules,
    emittedFlag: 'darkModeStyleEmitted',
  })

  return emitted
}

export function emitDarkModeHeadStyle(globalData) {
  return emitModifierHeadStyle(globalData)
}
