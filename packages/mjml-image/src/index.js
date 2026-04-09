import { min } from 'lodash'

import { BodyComponent, makeLowerBreakpoint } from 'mjml-core'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

import {
  emitOutlookDarkModeHeadRaw,
  getOutlookDarkModeMediaQuery,
  hasOutlookDarkModeFluidImage,
  OUTLOOK_DARK_MODE_BACKGROUND_CLASS,
  OUTLOOK_DARK_MODE_CLASS,
  registerOutlookDarkModeImage,
} from 'mjml-core/lib/helpers/outlookDarkMode'
import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjImage extends BodyComponent {
  static componentName = 'mj-image'

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    alt: 'string',
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-right': 'string',
    'border-top': 'string',
    'border-radius': 'string',
    'container-background-color': 'color',
    'dark-border-color': 'color',
    'dark-border-bottom-color': 'color',
    'dark-border-left-color': 'color',
    'dark-border-right-color': 'color',
    'dark-border-top-color': 'color',
    'dark-container-background-color': 'color',
    'dark-src': 'string',
    'fluid-on-mobile': 'boolean',
    'font-size': 'unit(px)',
    height: 'unit(px,auto)',
    href: 'string',
    'max-height': 'unit(px,%)',
    name: 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    rel: 'string',
    sizes: 'string',
    src: 'string',
    srcset: 'string',
    'support-dark-mode-image': 'enum(outlook)',
    target: 'string',
    title: 'string',
    usemap: 'string',
    width: 'unit(px)',
  }

  static defaultAttributes = {
    alt: '',
    align: 'center',
    border: '0',
    height: 'auto',
    padding: '10px 25px',
  }

  darkClasses = null

  registerDarkModeRuleGroup({
    cssDeclarations,
    supportOutlookDarkMode = false,
  }) {
    const globalData = this.context && this.context.globalData
    const validDeclarations = Array.isArray(cssDeclarations)
      ? cssDeclarations.filter(
          ({ cssProperty, cssValue }) => Boolean(cssProperty && cssValue),
        )
      : []

    if (!globalData || validDeclarations.length === 0) {
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

    validDeclarations.forEach(({ cssProperty, cssValue }) => {
      globalData.darkModeRules.push({
        className,
        cssProperty,
        cssValue,
        supportOutlookDarkMode: Boolean(supportOutlookDarkMode),
      })
    })

    return className
  }

  getDarkClasses() {
    if (this.darkClasses !== null) {
      return this.darkClasses
    }

    this.darkClasses = {}

    const globalData = this.context && this.context.globalData

    const darkContainerBg = this.attributes['dark-container-background-color']
    if (darkContainerBg) {
      this.darkClasses.container = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      })
    }

    const darkBorderColor = this.attributes['dark-border-color']
    const borderDarkDeclarations = []

    if (darkBorderColor) {
      borderDarkDeclarations.push({
        cssProperty: 'border-color',
        cssValue: darkBorderColor,
      })
    }

    ;[
      ['border-top-color', this.attributes['dark-border-top-color']],
      ['border-bottom-color', this.attributes['dark-border-bottom-color']],
      ['border-left-color', this.attributes['dark-border-left-color']],
      ['border-right-color', this.attributes['dark-border-right-color']],
    ].forEach(([cssProperty, cssValue]) => {
      if (!cssValue || (darkBorderColor && cssValue === darkBorderColor)) {
        return
      }

      borderDarkDeclarations.push({
        cssProperty,
        cssValue,
      })
    })

    const hasVisibleBorder = Boolean(
      this.getAttribute('border') ||
        this.getAttribute('border-left') ||
        this.getAttribute('border-right') ||
        this.getAttribute('border-top') ||
        this.getAttribute('border-bottom'),
    )

    this.darkClasses.border = hasVisibleBorder
      ? this.registerDarkModeRuleGroup({
          cssDeclarations: borderDarkDeclarations,
        })
      : null

    return this.darkClasses
  }

  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const containerDarkClass = this.getDarkClasses().container
      return [base, containerDarkClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  getStyles() {
    const width = this.getContentWidth()
    const fullWidth = this.getAttribute('full-width') === 'full-width'
    const horizontalBorderWidth = this.getHorizontalBorderWidth()

    const { parsedWidth, unit } = widthParser(width)
    const tdWidth = parsedWidth - horizontalBorderWidth

    return {
      img: {
        display: 'block',
        height: this.getAttribute('height'),
        'max-height': this.getAttribute('max-height'),
        'min-width': fullWidth ? '100%' : null,
        width: '100%',
      },
      td: {
        border: this.getAttribute('border'),
        'border-left': this.getAttribute('border-left'),
        'border-right': this.getAttribute('border-right'),
        'border-top': this.getAttribute('border-top'),
        'border-bottom': this.getAttribute('border-bottom'),
        'border-radius': this.getAttribute('border-radius'),
        width: fullWidth ? null : `${Math.max(0, tdWidth)}${unit}`,
      },
      table: {
        'min-width': fullWidth ? '100%' : null,
        'max-width': fullWidth ? '100%' : null,
        width: fullWidth ? `${parsedWidth}${unit}` : null,
        'border-collapse': 'collapse',
      },
      outlookDarkBackground: {
        'background-color': '#f7f7f7',
      },
      outlookDarkPicture: {
        'text-align': 'center',
        width: '100%',
        height: 'auto',
      },
    }
  }

  getContentWidth() {
    const width = this.getAttribute('width')
      ? parseInt(this.getAttribute('width'), 10)
      : Infinity

    const { box } = this.getBoxWidths()

    return min([box, width])
  }

  static parseBorderWidthValue(value) {
    if (!value) {
      return 0
    }

    const normalizedValue = String(value).trim()
    const pxMatch = normalizedValue.match(/(-?\d*\.?\d+)\s*px\b/i)

    if (pxMatch) {
      return Math.max(0, parseFloat(pxMatch[1]))
    }

    const numericMatch = normalizedValue.match(/^(-?\d*\.?\d+)$/)

    if (numericMatch) {
      return Math.max(0, parseFloat(numericMatch[1]))
    }

    return 0
  }

  getHorizontalBorderWidth() {
    const border = this.getAttribute('border')
    const borderLeft = this.getAttribute('border-left') || border
    const borderRight = this.getAttribute('border-right') || border

    return (
      MjImage.parseBorderWidthValue(borderLeft) +
      MjImage.parseBorderWidthValue(borderRight)
    )
  }

  supportOutlookDarkModeImage() {
    return this.getAttribute('support-dark-mode-image') === 'outlook'
  }

  renderImage() {
    const height = this.getAttribute('height')
    const darkSrc = this.getAttribute('dark-src')
    const supportOutlookDarkMode = this.supportOutlookDarkModeImage()
    const fluidOnMobile = this.getAttribute('fluid-on-mobile')
    const globalData = this.context && this.context.globalData

    let darkPictureClass = null

    if (darkSrc && supportOutlookDarkMode) {
      darkPictureClass = registerOutlookDarkModeImage(globalData, {
        darkSrc,
        fluidOnMobile: Boolean(fluidOnMobile),
        backgroundTarget: 'child-div',
      })
    }

    const img = `
      <img
        ${this.htmlAttributes({
          alt: this.getAttribute('alt'),
          src: this.getAttribute('src'),
          srcset: this.getAttribute('srcset'),
          sizes: this.getAttribute('sizes'),
          style: 'img',
          title: this.getAttribute('title'),
          width: this.getContentWidth(),
          usemap: this.getAttribute('usemap'),
          ...(height
            ? { height: height === 'auto' ? height : parseInt(height, 10) }
            : {}),
        })}
      />
    `

    const picture = darkSrc
      ? `
        <picture>
          <source ${this.htmlAttributes({
            srcset: darkSrc,
            media: '(prefers-color-scheme: dark)',
          })} />
          ${img}
        </picture>
      `
      : null

    const hasLink = !!this.getAttribute('href')

    const linkAttrs = hasLink
      ? this.htmlAttributes({
          href: this.getAttribute('href'),
          target: this.getAttribute('target'),
          rel: this.getAttribute('rel'),
          name: this.getAttribute('name'),
          title: this.getAttribute('title'),
        })
      : null

    const darkImg = darkSrc && supportOutlookDarkMode
      ? `
        <div ${this.htmlAttributes({
          style: 'outlookDarkBackground',
          class: `${OUTLOOK_DARK_MODE_BACKGROUND_CLASS}${
            darkPictureClass ? ` ${darkPictureClass}` : ''
          }`,
        })}>
          <div ${this.htmlAttributes({
            style: 'outlookDarkPicture',
            class: OUTLOOK_DARK_MODE_CLASS,
          })}>
            ${hasLink ? `<a ${linkAttrs}>` : ''}
            ${picture}
            ${hasLink ? `</a>` : ''}
          </div>    
        </div>
      `
      : null

    const content = darkImg || picture || img

    if (hasLink && !darkImg) {
      return `
        <a ${linkAttrs}>
          ${content}
        </a>
      `
    }

    return content
  }

  componentHeadStyle = (breakpoint) => {
    const globalData = this.context && this.context.globalData

    const styles = []

    const fluidOnMobile = this.getAttribute('fluid-on-mobile')

    if (fluidOnMobile) {
      const includeFluidStyles =
        !globalData || globalData.imageFluidOnMobileStyleEmitted === false

      if (includeFluidStyles) {
        if (globalData) {
          globalData.imageFluidOnMobileStyleEmitted = true
        }

        const includeOutlookFluidPictureWidthRule =
          globalData && hasOutlookDarkModeFluidImage(globalData)

        const outlookFluidPictureWidthRule = includeOutlookFluidPictureWidthRule
          ? '\n      .mj-full-width-mobile .mj-dark-image { width: 100% !important; }'
          : ''

        styles.push(`
    @media only screen and (max-width:${makeLowerBreakpoint(breakpoint)}) {
      .mj-full-width-mobile { width: 100% !important; }
      .mj-full-width-mobile td { width: auto !important; }${outlookFluidPictureWidthRule}
    }
  `)
      }
    }

    const darkSrc = this.getAttribute('dark-src')
    const supportOutlookDarkMode = this.supportOutlookDarkModeImage()
    const darkClasses = this.getDarkClasses()

    if (darkClasses.border || darkClasses.container) {
      emitDarkModeHeadStyle(globalData)
    }

    if (darkSrc && supportOutlookDarkMode) {
      const includeDarkStyles =
        !globalData || globalData.outlookDarkModeStyleEmitted === false

      if (includeDarkStyles) {
        emitOutlookDarkModeHeadRaw(globalData)
        styles.push(getOutlookDarkModeMediaQuery(globalData))
      }
    }

    return styles.join('\n')
  }

  render() {
    const borderDarkClass = this.getDarkClasses().border

    return `
      <table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
          style: 'table',
          class: this.getAttribute('fluid-on-mobile')
            ? 'mj-full-width-mobile'
            : null,
        })}
      >
        <tr>
          <td ${this.htmlAttributes({
            style: 'td',
            class: borderDarkClass || undefined,
          })}>
            ${this.renderImage()}
          </td>
        </tr>
      </table>
    `
  }
}
