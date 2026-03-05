import { isFunction } from 'lodash'

export function buildStyleFromComponents(
  breakpoint,
  componentsHeadStyles,
  headStylesObject,
) {
  const headStyles = Object.values(headStylesObject)

  const styleFunctions = [...componentsHeadStyles, ...headStyles]

  if (styleFunctions.length === 0) {
    return ''
  }

  const css = styleFunctions
    .map((style) => (isFunction(style) ? style(breakpoint) : style))
    .filter((s) => s && String(s).trim().length > 0)
    .reduce((result, style) => `${result}\n${style}`, '')

  if (!css || css.trim().length === 0) {
    return ''
  }

  return `<style>${css}
    </style>`
}

export function buildStyleFromTags(breakpoint, styles) {
  if (styles.length === 0) {
    return ''
  }

  return `    <style>${styles.reduce(
    (result, style) =>
      `${result}\n${isFunction(style) ? style(breakpoint) : style}`,
    '',
  )}
    </style>`
}
