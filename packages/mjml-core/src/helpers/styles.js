import { isFunction } from 'lodash'

export function buildStyleFromComponents(
  breakpoint,
  componentsHeadStyles,
  headStylesObject,
) {
  const { 'mj-accordion': accordionHeadStyle, ...headStylesWithoutAccordion } =
    headStylesObject || {}

  const headStyles = Object.values(headStylesWithoutAccordion)
  const styleFunctions = [...componentsHeadStyles, ...headStyles]

  const buildCss = (styles) => {
    const css = (styles || [])
      .map((style) => (isFunction(style) ? style(breakpoint) : style))
      .filter((s) => s && String(s).trim().length > 0)
      .reduce((result, style) => `${result}\n${style}`, '')

    return css && css.trim().length > 0 ? css : ''
  }

  const css = buildCss(styleFunctions)

  const accordionCss = accordionHeadStyle
    ? buildCss([accordionHeadStyle])
    : ''

  if (!css && !accordionCss) {
    return ''
  }

  const blocks = []

  if (css) {
    blocks.push(`<style>${css}
    </style>`)
  }

  if (accordionCss) {
    blocks.push(`<style type="text/css">${accordionCss}
    </style>`)
  }

  return blocks.join('\n')
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
