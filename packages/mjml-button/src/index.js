import { BodyComponent } from 'mjml-core'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjButton extends BodyComponent {
  static componentName = 'mj-button'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'background-color': 'color',
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-radius': 'string',
    'border-right': 'string',
    'border-top': 'string',
    color: 'color',
    'container-background-color': 'color',
    'dark-background-color': 'color',
    'dark-border-color': 'color',
    'dark-border-bottom-color': 'color',
    'dark-border-left-color': 'color',
    'dark-border-right-color': 'color',
    'dark-border-top-color': 'color',
    'dark-color': 'color',
    'dark-container-background-color': 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-style': 'string',
    'font-weight': 'string',
    height: 'unit(px,%)',
    href: 'string',
    'inner-padding': 'unit(px,%){1,4}',
    'letter-spacing': 'unitWithNegative(px,em)',
    'line-height': 'unit(px,%,)',
    multiline: 'boolean',
    name: 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    rel: 'string',
    target: 'string',
    'text-align': 'enum(left,right,center)',
    'text-decoration': 'string',
    'text-transform': 'string',
    title: 'string',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%)',
  }

  static defaultAttributes = {
    align: 'center',
    'background-color': '#414141',
    border: 'none',
    'border-radius': '3px',
    color: '#ffffff',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '13px',
    'inner-padding': '10px 25px',
    'line-height': '120%',
    multiline: 'false',
    padding: '10px 25px',
    'text-decoration': 'none',
    'vertical-align': 'middle',
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

    const darkBackgroundColor = this.attributes['dark-background-color']
    const darkBorderColor = this.attributes['dark-border-color']
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
      ['border-top-color', this.attributes['dark-border-top-color']],
      ['border-bottom-color', this.attributes['dark-border-bottom-color']],
      ['border-left-color', this.attributes['dark-border-left-color']],
      ['border-right-color', this.attributes['dark-border-right-color']],
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
        cssValue: this.attributes['dark-color'],
      },
    ]

    this.darkClasses.content = this.registerDarkModeRuleGroup({
      cssDeclarations: contentDarkDeclarations,
    })

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

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
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
        'letter-spacing': this.getAttribute('letter-spacing'),
        ...(!this.getAttribute('href') && { margin: '0' }),
        'text-decoration': this.getAttribute('text-decoration'),
        'text-transform': this.getAttribute('text-transform'),
        padding: this.getAttribute('inner-padding'),
        border: `1px solid ${this.getAttribute('background-color')}`,
        ...(this.getAttribute('multiline') === true && { 'mso-padding-alt': '0px' }),
        'border-radius': this.getAttribute('border-radius'),
      },
    }
  }

  calculateAWidth(width) {
    if (!width) return null

    const { parsedWidth, unit } = widthParser(width)

    // impossible to handle percents because it depends on padding and text width
    if (unit !== 'px') return null

    const { borders } = this.getBoxWidths()

    const innerPaddings =
      this.getShorthandAttrValue('inner-padding', 'left') +
      this.getShorthandAttrValue('inner-padding', 'right')

    return `${parsedWidth - innerPaddings - borders}px`
  }

  render() {
    const tag = this.getAttribute('href') ? 'a' : 'p'
    const { button: buttonDarkClass, content: contentDarkClass } = this.getDarkClasses()

    return `
      <table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
          style: 'table',
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
              class: buttonDarkClass || undefined,
              role: 'none',
              style: 'td',
              valign: this.getAttribute('vertical-align'),
            })}
          >
            <${tag}
              ${this.htmlAttributes({
                class: contentDarkClass || undefined,
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
