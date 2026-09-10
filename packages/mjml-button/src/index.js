import { BodyComponent } from 'mjml-core'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
  registerResponsivePaddingGroup,
} from 'mjml-core/lib/helpers/responsiveMode'

import widthParser from 'mjml-core/lib/helpers/widthParser'

function computeAlignMargin(align) {
  if (align === 'left') return '0 auto 0 0'
  if (align === 'right') return '0 0 0 auto'
  return '0 auto'
}

export default class MjButton extends BodyComponent {
  static componentName = 'mj-button'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'align--responsive': 'enum(left,center,right)',
    'background-color': 'color',
    'background-color--dark': 'color',
    border: 'string',
    'border-color--dark': 'color',
    'border-bottom': 'string',
    'border-bottom-color--dark': 'color',
    'border-left': 'string',
    'border-left-color--dark': 'color',
    'border-radius': 'string',
    'border-right': 'string',
    'border-right-color--dark': 'color',
    'border-top': 'string',
    'border-top-color--dark': 'color',
    color: 'color',
    'color--dark': 'color',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
    'container-border-radius': 'string',
    'font-family': 'string',
    'font-size': 'unit(px,rem)',
    'font-size--responsive': 'unit(px,rem)',
    'font-style': 'string',
    'font-weight': 'string',
    height: 'unit(px,%)',
    'height--responsive': 'unit(px,%)',
    href: 'string',
    'inner-padding': 'unit(px,%){1,4}',
    'inner-padding--responsive': 'unit(px,%){1,4}',
    'letter-spacing': 'unitWithNegative(px,em)',
    'line-height': 'unit(px,%,em,rem)',
    'line-height--responsive': 'unit(px,%,em,rem)',
    multiline: 'boolean',
    name: 'string',
    padding: 'unit(px,%){1,4}',
    'padding--responsive': 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-bottom--responsive': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-left--responsive': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-right--responsive': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding-top--responsive': 'unit(px,%)',
    rel: 'string',
    target: 'string',
    'text-align': 'enum(left,right,center)',
    'text-decoration': 'string',
    'text-transform': 'string',
    title: 'string',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%)',
    'width--responsive': 'unit(px,%)',
  }

  static defaultAttributes = {
    align: 'center',
    'background-color': '#414141',
    border: 'none',
    'border-radius': '3px',
    color: '#ffffff',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '16px',
    'inner-padding': '10px 25px',
    'line-height': '150%',
    multiline: 'false',
    padding: '10px 25px',
    'text-decoration': 'none',
    'vertical-align': 'middle',
  }

  darkClasses = null

  responsiveClasses = null

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

    const darkContainerBg = this.attributes['container-background-color--dark']
    if (darkContainerBg) {
      this.darkClasses.container = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      })
    }

    const darkBackgroundColor = this.attributes['background-color--dark']
    const darkBorderColor = this.attributes['border-color--dark']
    const buttonDarkDeclarations = []

    if (darkBackgroundColor) {
      buttonDarkDeclarations.push({
        cssProperty: 'background-color',
        cssValue: darkBackgroundColor,
      })
    }

    if (darkBorderColor) {
      buttonDarkDeclarations.push({
        cssProperty: 'border-color',
        cssValue: darkBorderColor,
      })
    }

    ;[
      ['border-top-color', this.attributes['border-top-color--dark']],
      ['border-bottom-color', this.attributes['border-bottom-color--dark']],
      ['border-left-color', this.attributes['border-left-color--dark']],
      ['border-right-color', this.attributes['border-right-color--dark']],
    ].forEach(([cssProperty, cssValue]) => {
      if (!cssValue || (darkBorderColor && cssValue === darkBorderColor)) {
        return
      }

      buttonDarkDeclarations.push({
        cssProperty,
        cssValue,
      })
    })

    this.darkClasses.button = this.registerDarkModeRuleGroup({
      cssDeclarations: buttonDarkDeclarations,
    })

    const contentDarkDeclarations = [
      {
        cssProperty: 'background-color',
        cssValue: darkBackgroundColor,
      },
      {
        cssProperty: 'border-color',
        cssValue: darkBackgroundColor,
      },
      {
        cssProperty: 'color',
        cssValue: this.attributes['color--dark'],
      },
    ]

    this.darkClasses.content = this.registerDarkModeRuleGroup({
      cssDeclarations: contentDarkDeclarations,
    })

    return this.darkClasses
  }

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) return this.responsiveClasses

    this.responsiveClasses = {
      container: null,
      table: null,
      td: null,
      content: null,
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses.container = registerResponsivePaddingGroup(globalData, this.attributes)

    const alignResponsive = this.attributes['align--responsive']

    this.responsiveClasses.table = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['margin', alignResponsive ? computeAlignMargin(alignResponsive) : null],
        ['width', this.attributes['width--responsive']],
      ]),
    })

    this.responsiveClasses.td = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['height', this.attributes['height--responsive']],
      ]),
    })

    const innerPaddingResponsive = this.attributes['inner-padding--responsive']
    const responsiveInnerPadding =
      innerPaddingResponsive || this.getAttribute('inner-padding')
    const contentPaddingResponsive = innerPaddingResponsive
      ? innerPaddingResponsive
          .split(/\s+/)
          .map((v) => this.constructor.subtractContentBorder(v))
          .join(' ')
      : null

    this.responsiveClasses.content = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['font-size', this.attributes['font-size--responsive']],
        ['line-height', this.attributes['line-height--responsive']],
        [
          'width',
          this.calculateAWidth(
            this.attributes['width--responsive'],
            responsiveInnerPadding,
          ),
        ],
        ['padding', contentPaddingResponsive],
      ]),
    })

    return this.responsiveClasses
  }

  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const containerDarkClass = this.getDarkClasses().container
      const containerResponsiveClass = this.getResponsiveClasses().container
      return [base, containerDarkClass, containerResponsiveClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    emitResponsiveHeadStyle(this.context && this.context.globalData)
    return ''
  }

  getContentPadding() {
    const innerPadding = this.getAttribute('inner-padding')

    if (!innerPadding) return innerPadding

    return innerPadding
      .split(/\s+/)
      .map((value) => this.constructor.subtractContentBorder(value))
      .join(' ')
  }

  static subtractContentBorder(value) {
    const match = /^(\d*\.?\d+)(px|%)$/.exec(value)

    if (!match) return value

    const [, rawAmount, unit] = match

    if (unit !== 'px') return value

    return `${Math.max(parseFloat(rawAmount) - 1, 0)}px`
  }

  getStyles() {
    return {
      table: {
        'border-collapse': 'separate',
        width: this.getAttribute('width'),
        'line-height': '100%',
      },
      td: {
        border: this.getAttribute('border'),
        'border-bottom': this.getAttribute('border-bottom'),
        'border-left': this.getAttribute('border-left'),
        'border-radius': this.getAttribute('border-radius'),
        'border-right': this.getAttribute('border-right'),
        'border-top': this.getAttribute('border-top'),
        'font-style': this.getAttribute('font-style'),
        height: this.getAttribute('height'),
        ...(this.getAttribute('multiline') === true &&
          this.context?.globalData?.supportOutlookClassic !== false && {
            'mso-padding-alt': this.getContentPadding(),
          }),
        'text-align': this.getAttribute('text-align'),
        background: this.getAttribute('background-color'),
      },
      content: {
        ...(this.getAttribute('multiline') === true ? { display: 'inline-block' } : { display: 'block' }),
        width: this.calculateAWidth(this.getAttribute('width')),
        background: this.getAttribute('background-color'),
        color: this.getAttribute('color'),
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'font-style': this.getAttribute('font-style'),
        'font-weight': this.getAttribute('font-weight'),
        'line-height': this.getAttribute('line-height'),
        'mso-line-height-alt': '120%',
        'letter-spacing': this.getAttribute('letter-spacing'),
        ...(!this.getAttribute('href') && { margin: '0' }),
        'text-decoration': this.getAttribute('text-decoration'),
        'text-transform': this.getAttribute('text-transform'),
        padding: this.getContentPadding(),
        border: `1px solid ${this.getAttribute('background-color')}`,
        ...(this.getAttribute('multiline') === true &&
          this.context?.globalData?.supportOutlookClassic !== false && {
            'mso-padding-alt': '0px',
          }),
        'border-radius': this.getAttribute('border-radius'),
      },
    }
  }

  calculateAWidth(width, innerPadding) {
    if (!width) return null

    const { parsedWidth, unit } = widthParser(width)

    // impossible to handle percents because it depends on padding and text width
    if (unit !== 'px') return null

    const { borders } = this.getBoxWidths()

    const innerPaddings = innerPadding
      ? this.constructor.getHorizontalPadding(innerPadding)
      : this.getShorthandAttrValue('inner-padding', 'left') +
        this.getShorthandAttrValue('inner-padding', 'right')

    return `${parsedWidth - innerPaddings - borders}px`
  }

  static getHorizontalPadding(padding) {
    const values = String(padding).trim().split(/\s+/)

    if (values.length === 1) return parseInt(values[0], 10) * 2
    if (values.length <= 3) return parseInt(values[1], 10) * 2

    return parseInt(values[1], 10) + parseInt(values[3], 10)
  }

  render() {
    const tag = this.getAttribute('href') ? 'a' : 'p'
    const { button: buttonDarkClass, content: contentDarkClass } = this.getDarkClasses()
    const {
      table: tableResponsiveClass,
      td: tdResponsiveClass,
      content: contentResponsiveClass,
    } = this.getResponsiveClasses()

    return `
      <table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
          style: 'table',
          class: tableResponsiveClass || null,
        })}
      >
        <tr>
          <td
            ${this.htmlAttributes({
              align: 'center',
              bgcolor:
                this.getAttribute('background-color') === 'none'
                  ? undefined
                  : this.getAttribute('background-color'),
              class: [buttonDarkClass, tdResponsiveClass].filter(Boolean).join(' ') || undefined,
              role: 'none',
              style: 'td',
              valign: this.getAttribute('vertical-align'),
            })}
          >
            <${tag}
              ${this.htmlAttributes({
                class: [contentDarkClass, contentResponsiveClass].filter(Boolean).join(' ') || undefined,
                href: this.getAttribute('href'),
                name: this.getAttribute('name'),
                rel: this.getAttribute('rel'),
                title: this.getAttribute('title'),
                style: 'content',
                target: tag === 'a' ? this.getAttribute('target') : undefined,
              })}
            >${this.getContent()}</${tag}>
          </td>
        </tr>
      </table>
    `
  }
}
