export const DARK_MODE_CLASS_PREFIX = 'mj-dark'

function getDarkModeRules(globalData) {
  return Array.isArray(globalData && globalData.darkModeRules)
    ? globalData.darkModeRules
    : []
}

function formatGroupedRules(rules, selectorPrefix = '') {
  const declarationGroups = new Map()

  rules.forEach(({ className, cssProperty, cssValue }) => {
    const declaration = `${cssProperty}: ${cssValue} !important;`
    const selector = `${selectorPrefix}.${className}`

    if (!declarationGroups.has(declaration)) {
      declarationGroups.set(declaration, new Set())
    }

    declarationGroups.get(declaration).add(selector)
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
  if (!globalData || !cssValue) {
    return null
  }

  if (typeof globalData.darkModeRuleCount !== 'number') {
    globalData.darkModeRuleCount = 0
  }

  globalData.darkModeRuleCount += 1

  const className = `${DARK_MODE_CLASS_PREFIX}-${globalData.darkModeRuleCount}`

  if (!Array.isArray(globalData.darkModeRules)) {
    globalData.darkModeRules = []
  }

  globalData.darkModeRules.push({
    className,
    cssProperty,
    cssValue,
    supportOutlookDarkMode: Boolean(supportOutlookDarkMode),
  })

  return className
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
export function emitDarkModeHeadStyle(globalData) {
  if (!globalData || globalData.darkModeStyleEmitted === true) {
    return false
  }

  const rules = getDarkModeRules(globalData)

  if (rules.length === 0) {
    return false
  }

  const cssRules = formatGroupedRules(rules)

  const outlookRules = formatGroupedRules(
    rules.filter(({ supportOutlookDarkMode }) => supportOutlookDarkMode),
    '[data-ogsb] ',
  )

  globalData.darkModeStyleEmitted = true

  globalData.headRaw.push(`<style>
@media (prefers-color-scheme: dark) {
${cssRules}
}
${outlookRules}
</style>`)

  return true
}
