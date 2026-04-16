import { BodyComponent } from 'mjml-core'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjAccordionText extends BodyComponent {
  static componentName = 'mj-accordion-text'

  static endingTag = true

  static allowedAttributes = {
    'background-color': 'color',
    color: 'color',
    'dark-background-color': 'color',
    'dark-color': 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-weight': 'string',
    'letter-spacing': 'unitWithNegative(px,em)',
    'line-height': 'unit(px,%,)',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
  }

  static defaultAttributes = {
    'font-size': '13px',
    'line-height': '1',
    padding: '16px',
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

    const contentDeclarations = []

    const darkBackgroundColor = this.getAttribute('dark-background-color')
    if (darkBackgroundColor) {
      contentDeclarations.push({
        cssProperty: 'background-color',
        cssValue: darkBackgroundColor,
      })
    }

    const darkColor = this.getAttribute('dark-color')
    if (darkColor) {
      contentDeclarations.push({
        cssProperty: 'color',
        cssValue: darkColor,
      })
    }

    this.darkClasses.content = this.registerDarkModeRuleGroup({
      cssDeclarations: contentDeclarations,
    })

    // Inherited from mj-accordion-element; text borders are rendered on the
    // inner table as border-bottom.
    const darkBorderColor = this.getAttribute('dark-border-color')
    if (darkBorderColor) {
      this.darkClasses.border = registerDarkModeRule(globalData, {
        cssProperty: 'border-bottom-color',
        cssValue: darkBorderColor,
      })
    }

    return this.darkClasses
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
  }

  getStyles() {
    return {
      td: {
        background: this.getAttribute('background-color'),
        'font-size': this.getAttribute('font-size'),
        'font-family': this.resolveFontFamily(),
        'font-weight': this.getAttribute('font-weight'),
        'letter-spacing': this.getAttribute('letter-spacing'),
        'line-height': this.getAttribute('line-height'),
        color: this.getAttribute('color'),
        padding: this.getAttribute('padding'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-top': this.getAttribute('padding-top'),
      },
      table: {
        width: '100%',
        ...(this.getAttribute('border') !== 'none' && this.getAttribute('border') !== '0' && this.getAttribute('border') !== '0px' && { 'border-bottom': this.getAttribute('border') }),
      },
    }
  }

  renderContent() {
    const contentDarkClass = this.getDarkClasses().content

    return `
      <td
        ${this.htmlAttributes({
          class: [this.getAttribute('css-class'), contentDarkClass]
            .filter(Boolean)
            .join(' ') || undefined,
          style: 'td',
        })}
      >
        ${this.getContent()}
      </td>
    `
  }

  resolveFontFamily() {
    if (
      this.props &&
      this.props.rawAttrs &&
      Object.prototype.hasOwnProperty.call(this.props.rawAttrs, 'font-family')
    ) {
      return this.getAttribute('font-family')
    }
    if (this.context && this.context.elementFontFamily) {
      return this.context.elementFontFamily
    }
    if (this.context && this.context.accordionFontFamily) {
      return this.context.accordionFontFamily
    }
    return MjAccordionText.defaultAttributes.fontFamily
  }

  render() {
    const borderDarkClass = this.getDarkClasses().border

    return `
      <div
        ${this.htmlAttributes({
          class: 'mj-accordion-content',
        })}
      >
        <table
          ${this.htmlAttributes({
            cellspacing: '0',
            cellpadding: '0',
            class: borderDarkClass || undefined,
            style: 'table',
          })}
        >
          <tr>
            ${this.renderContent()}
          </tr>
        </table>
      </div>
    `
  }
}
