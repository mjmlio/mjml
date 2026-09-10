export const OUTLOOK_DARK_MODE_CLASS = 'mj-dark-image'
export const OUTLOOK_DARK_MODE_BACKGROUND_CLASS = 'mj-dark-image-bg'

const getOutlookDarkModeImages = (globalData) =>
  Array.isArray(globalData && globalData.outlookDarkModeImages)
    ? globalData.outlookDarkModeImages
    : []

const getOutlookDarkModeBackgroundRules = (globalData) =>
  Array.isArray(globalData && globalData.outlookDarkModeBackgroundRules)
    ? globalData.outlookDarkModeBackgroundRules
    : []

const getOutlookDarkModeImageClassMap = (globalData) => {
  if (!globalData) {
    return {}
  }

  if (!globalData.outlookDarkModeImageClassMap) {
    globalData.outlookDarkModeImageClassMap = {}
  }

  return globalData.outlookDarkModeImageClassMap
}

export function registerOutlookDarkModeImage(globalData, options = {}) {
  const {
    darkSrc,
    cacheKey,
    classPrefix = OUTLOOK_DARK_MODE_CLASS,
    ...metadata
  } = options

  if (!globalData || !darkSrc) {
    return null
  }

  if (cacheKey) {
    const classMap = getOutlookDarkModeImageClassMap(globalData)

    if (classMap[cacheKey]) {
      return classMap[cacheKey]
    }
  }

  if (typeof globalData.outlookDarkModeImageCount !== 'number') {
    globalData.outlookDarkModeImageCount = 0
  }

  globalData.outlookDarkModeImageCount += 1

  const className = `${classPrefix}-${globalData.outlookDarkModeImageCount}`

  if (!Array.isArray(globalData.outlookDarkModeImages)) {
    globalData.outlookDarkModeImages = []
  }

  globalData.outlookDarkModeImages.push({
    className,
    darkSrc,
    ...metadata,
  })

  if (cacheKey) {
    getOutlookDarkModeImageClassMap(globalData)[cacheKey] = className
  }

  return className
}

export function hasOutlookDarkModeFluidImage(globalData) {
  return getOutlookDarkModeImages(globalData).some(
    ({ fluidOnMobile }) => fluidOnMobile,
  )
}

export function registerOutlookDarkModeBackgroundRule(globalData, options = {}) {
  const {
    className,
    backgroundColor,
  } = options

  if (!globalData || !className || !backgroundColor) {
    return false
  }

  if (!Array.isArray(globalData.outlookDarkModeBackgroundRules)) {
    globalData.outlookDarkModeBackgroundRules = []
  }

  const exists = globalData.outlookDarkModeBackgroundRules.some(
    (rule) =>
      rule.className === className && rule.backgroundColor === backgroundColor,
  )

  if (exists) {
    return false
  }

  globalData.outlookDarkModeBackgroundRules.push({
    className,
    backgroundColor,
  })

  return true
}

export function emitOutlookDarkModeHeadRaw(globalData) {
  if (!globalData || globalData.outlookDarkModeStyleEmitted === true) {
    return false
  }

  const darkSrcImages = getOutlookDarkModeImages(globalData)

  if (darkSrcImages.length === 0) {
    return false
  }

  const outlookBackgroundRules = darkSrcImages
    .map(
      ({ className, darkSrc, backgroundTarget }) => {
        const selector = backgroundTarget === 'child-div'
          ? `[data-ogsb] .${className} > div`
          : `[data-ogsb] .${className}`

        return `    ${selector} { background:url(${JSON.stringify(
          darkSrc,
        )}) no-repeat center; background-size: 100% 100%; }`
      },
    )
    .join('\n')

  // Group background color rules by value
  const backgroundColorMap = {}
  getOutlookDarkModeBackgroundRules(globalData).forEach(({ className, backgroundColor }) => {
    if (!backgroundColorMap[backgroundColor]) {
      backgroundColorMap[backgroundColor] = []
    }
    backgroundColorMap[backgroundColor].push(className)
  })

  const outlookBackgroundColorRules = Object.entries(backgroundColorMap)
    .map(([backgroundColor, classNames]) => {
      const selectors = classNames
        .map(className => `[data-ogsb] .${className}`)
        .join(',\n      ')
      return `    ${selectors} {
        background-color: ${backgroundColor} !important;
      }`
    })
    .join('\n')

  globalData.outlookDarkModeStyleEmitted = true

  globalData.headRaw.push(`
<style id="css-dark-mode-outlook-com">
    [data-ogsb] { color:#fff !important; background-color:#1c1c1c !important; }
${outlookBackgroundRules}
${outlookBackgroundColorRules}
  [data-ogsb] .${OUTLOOK_DARK_MODE_CLASS} img { visibility:hidden; }
</style>
          `)

  return true
}

export function getOutlookDarkModeMediaQuery(globalData) {
  // Group background color rules by value
  const backgroundColorMap = {}
  getOutlookDarkModeBackgroundRules(globalData).forEach(({ className, backgroundColor }) => {
    if (!backgroundColorMap[backgroundColor]) {
      backgroundColorMap[backgroundColor] = []
    }
    backgroundColorMap[backgroundColor].push(className)
  })

  const outlookBackgroundColorMediaRules = Object.entries(backgroundColorMap)
    .map(([backgroundColor, classNames]) => {
      const selectors = classNames
        .map(className => `.${OUTLOOK_DARK_MODE_BACKGROUND_CLASS}.${className}:not([class^="x_"])`)
        .join(',\n      ')
      return `    ${selectors} {
      background-color: ${backgroundColor} !important;
    }`
    })
    .join('\n')

  return `
@media (prefers-color-scheme:dark) {
    .${OUTLOOK_DARK_MODE_BACKGROUND_CLASS}:not([class^="x_"]) { color:#fff !important; background-color:#1c1c1c !important; }
    .${OUTLOOK_DARK_MODE_CLASS}:not([class^="x_"]) img { color:#fff !important; }
${outlookBackgroundColorMediaRules}
}
        `
}
