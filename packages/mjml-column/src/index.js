import { BodyComponent } from 'mjml-core'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjColumn extends BodyComponent {
  static componentName = 'mj-column'

  static allowedAttributes = {
    'background-color': 'color',
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-radius': 'string',
    'border-right': 'string',
    'border-top': 'string',
    'dark-background-color': 'color',
    'dark-border-color': 'color',
    'dark-border-bottom-color': 'color',
    'dark-border-left-color': 'color',
    'dark-border-right-color': 'color',
    'dark-border-top-color': 'color',
    'dark-inner-background-color': 'color',
    'dark-inner-border-color': 'color',
    'dark-inner-border-bottom-color': 'color',
    'dark-inner-border-left-color': 'color',
    'dark-inner-border-right-color': 'color',
    'dark-inner-border-top-color': 'color',
    direction: 'enum(ltr,rtl)',
    'inner-background-color': 'color',
    'inner-border': 'string',
    'inner-border-bottom': 'string',
    'inner-border-left': 'string',
    'inner-border-radius': 'string',
    'inner-border-right': 'string',
    'inner-border-top': 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%)',
  }

  static defaultAttributes = {
    'vertical-align': 'top',
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

    // Outer: background-color + border (applied to gutter td when gutter exists,
    // or to the column table when no gutter).
    const outerDeclarations = []

    const darkBgColor = this.attributes['dark-background-color']
    if (darkBgColor) {
      outerDeclarations.push({ cssProperty: 'background-color', cssValue: darkBgColor })
    }

    const darkBorderColor = this.attributes['dark-border-color']
    if (darkBorderColor) {
      outerDeclarations.push({ cssProperty: 'border-color', cssValue: darkBorderColor })
    }

    ;[
      ['border-top-color', 'dark-border-top-color'],
      ['border-bottom-color', 'dark-border-bottom-color'],
      ['border-left-color', 'dark-border-left-color'],
      ['border-right-color', 'dark-border-right-color'],
    ].forEach(([cssProperty, attrName]) => {
      const cssValue = this.attributes[attrName]
      if (!cssValue || (darkBorderColor && cssValue === darkBorderColor)) return
      outerDeclarations.push({ cssProperty, cssValue })
    })

    this.darkClasses.outer = this.registerDarkModeRuleGroup({
      cssDeclarations: outerDeclarations,
    })

    // Inner: inner-background-color + inner-border (always applied to the inner
    // column table; only relevant when a gutter/padding exists).
    const innerDeclarations = []

    const darkInnerBgColor = this.attributes['dark-inner-background-color']
    if (darkInnerBgColor) {
      innerDeclarations.push({ cssProperty: 'background-color', cssValue: darkInnerBgColor })
    }

    const darkInnerBorderColor = this.attributes['dark-inner-border-color']
    if (darkInnerBorderColor) {
      innerDeclarations.push({ cssProperty: 'border-color', cssValue: darkInnerBorderColor })
    }

    ;[
      ['border-top-color', 'dark-inner-border-top-color'],
      ['border-bottom-color', 'dark-inner-border-bottom-color'],
      ['border-left-color', 'dark-inner-border-left-color'],
      ['border-right-color', 'dark-inner-border-right-color'],
    ].forEach(([cssProperty, attrName]) => {
      const cssValue = this.attributes[attrName]
      if (!cssValue || (darkInnerBorderColor && cssValue === darkInnerBorderColor)) return
      innerDeclarations.push({ cssProperty, cssValue })
    })

    this.darkClasses.inner = this.registerDarkModeRuleGroup({
      cssDeclarations: innerDeclarations,
    })

    return this.darkClasses
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
  }

  getChildContext() {
    const { containerWidth: parentWidth } = this.context
    const { nonRawSiblings } = this.props
    const { borders, paddings } = this.getBoxWidths()
    const innerBorders =
      this.getShorthandBorderValue('left', 'inner-border') +
      this.getShorthandBorderValue('right', 'inner-border')

    const allPaddings = paddings + borders + innerBorders

    let containerWidth =
      this.getAttribute('width') ||
      `${parseFloat(parentWidth) / nonRawSiblings}px`

    const { unit, parsedWidth } = widthParser(containerWidth, {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      containerWidth = `${
        (parseFloat(parentWidth) * parsedWidth) / 100 - allPaddings
      }px`
    } else {
      containerWidth = `${parsedWidth - allPaddings}px`
    }

    return {
      ...this.context,
      containerWidth,
    }
  }

  getStyles() {
    const hasBorderRadius = this.hasBorderRadius()
    const hasInnerBorderRadius = this.hasInnerBorderRadius()

    const tableStyle = {
      'background-color': this.getAttribute('background-color'),
      border: this.getAttribute('border'),
      'border-bottom': this.getAttribute('border-bottom'),
      'border-left': this.getAttribute('border-left'),
      'border-radius': this.getAttribute('border-radius'),
      'border-right': this.getAttribute('border-right'),
      'border-top': this.getAttribute('border-top'),
      ...(hasBorderRadius && { 'border-collapse': 'separate' }),
    }

    return {
      div: {
        'font-size': '0px',
        'text-align': 'left',
        direction: this.getAttribute('direction'),
        display: 'inline-block',
        'vertical-align': this.getAttribute('vertical-align'),
        width: this.getMobileWidth(),
      },
      table: {
        ...(this.hasGutter()
          ? {
              'background-color': this.getAttribute('inner-background-color'),
              border: this.getAttribute('inner-border'),
              'border-bottom': this.getAttribute('inner-border-bottom'),
              'border-left': this.getAttribute('inner-border-left'),
              'border-radius': this.getAttribute('inner-border-radius'),
              'border-right': this.getAttribute('inner-border-right'),
              'border-top': this.getAttribute('inner-border-top'),
            }
          : tableStyle),
        ...(hasInnerBorderRadius && { 'border-collapse': 'separate' }),
      },
      tdOutlook: {
        'vertical-align': this.getAttribute('vertical-align'),
        width: this.getWidthAsPixel(),
      },
      gutter: {
        ...tableStyle,
        padding: this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
      },
    }
  }

  getMobileWidth() {
    const { containerWidth } = this.context
    const { nonRawSiblings } = this.props
    const width = this.getAttribute('width')
    const mobileWidth = this.getAttribute('mobileWidth')

    if (mobileWidth !== 'mobileWidth') {
      return '100%'
    }
    if (width === undefined) {
      return `${parseInt(100 / nonRawSiblings, 10)}%`
    }

    const { unit, parsedWidth } = widthParser(width, {
      parseFloatToInt: false,
    })

    switch (unit) {
      case '%':
        return width
      case 'px':
      default:
        return `${(parsedWidth / parseInt(containerWidth, 10)) * 100}%`
    }
  }

  getWidthAsPixel() {
    const { containerWidth } = this.context

    const { unit, parsedWidth } = widthParser(this.getParsedWidth(true), {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      return `${(parseFloat(containerWidth) * parsedWidth) / 100}px`
    }
    return `${parsedWidth}px`
  }

  getParsedWidth(toString) {
    const { nonRawSiblings } = this.props

    const width = this.getAttribute('width') || `${100 / nonRawSiblings}%`

    const { unit, parsedWidth } = widthParser(width, {
      parseFloatToInt: false,
    })

    if (toString) {
      return `${parsedWidth}${unit}`
    }

    return {
      unit,
      parsedWidth,
    }
  }

  getColumnClass() {
    const { addMediaQuery } = this.context

    let className = ''

    const { parsedWidth, unit } = this.getParsedWidth()
    const formattedClassNb = parsedWidth.toString().replace('.', '-')

    switch (unit) {
      case '%':
        className = `mj-column-per-${formattedClassNb}`
        break

      case 'px':
      default:
        className = `mj-column-px-${formattedClassNb}`
        break
    }

    // Add className to media queries
    addMediaQuery(className, {
      parsedWidth,
      unit,
    })

    return className
  }

  hasBorderRadius() {
    const borderRadius = this.getAttribute('border-radius')
    return borderRadius !== '' && typeof borderRadius !== 'undefined'
  }

  hasInnerBorderRadius() {
    const innerBorderRadius = this.getAttribute('inner-border-radius')
    return innerBorderRadius !== '' && typeof innerBorderRadius !== 'undefined'
  }

  hasGutter() {
    return [
      'padding',
      'padding-bottom',
      'padding-left',
      'padding-right',
      'padding-top',
    ].some((attr) => this.getAttribute(attr) != null)
  }

  renderGutter() {
    const hasBorderRadius = this.hasBorderRadius()
    const { outer: outerDarkClass } = this.getDarkClasses()

    return `
      <table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
          width: '100%',
          ...(hasBorderRadius && {
            style: { 'border-collapse': 'separate' },
          }),
        })}
      >
        <tr>
          <td ${this.htmlAttributes({
            class: outerDarkClass || undefined,
            style: 'gutter',
          })}>
            ${this.renderColumn()}
          </td>
        </tr>
      </table>
    `
  }

  renderColumn() {
    const { children } = this.props
    const { outer: outerDarkClass, inner: innerDarkClass } = this.getDarkClasses()
    // When a gutter exists the outer dark class is on the gutter <td>;
    // the column table carries the inner dark class instead.
    // When there is no gutter the column table IS the outer element.
    const columnTableDarkClass = this.hasGutter()
      ? (innerDarkClass || undefined)
      : (outerDarkClass || undefined)

    return `
      <table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
          class: columnTableDarkClass,
          style: 'table',
          width: '100%',
        })}
      >
        ${this.renderChildren(children, {
          renderer: (component) =>
            component.constructor.isRawElement()
              ? component.render()
              : `<tr>
              <td
                ${component.htmlAttributes({
                  align: component.getAttribute('align'),
                  class: component.getAttribute('css-class'),
                  style: {
                    background: component.getAttribute(
                      'container-background-color',
                    ),
                    'font-size': '0px',
                    padding: component.getAttribute('padding'),
                    'padding-top': component.getAttribute('padding-top'),
                    'padding-right': component.getAttribute('padding-right'),
                    'padding-bottom':
                      component.getAttribute('padding-bottom'),
                    'padding-left': component.getAttribute('padding-left'),
                    'word-break': 'break-word',
                  },
                })}
              >
                ${component.render()}
              </td>
            </tr>`,
        })}
      </table>
    `
  }

  render() {
    let classesName = `${this.getColumnClass()}`

    if (this.getAttribute('css-class')) {
      classesName += ` ${this.getAttribute('css-class')}`
    }

    return `
      <div
        ${this.htmlAttributes({
          class: classesName,
          style: 'div',
        })}
      >
        ${this.hasGutter() ? this.renderGutter() : this.renderColumn()}
      </div>
    `
  }
}
