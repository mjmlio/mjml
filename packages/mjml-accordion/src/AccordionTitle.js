import { BodyComponent } from 'mjml-core'
import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjAccordionTitle extends BodyComponent {
  static componentName = 'mj-accordion-title'

  static endingTag = true

  static allowedAttributes = {
    'background-color': 'color',
    color: 'color',
    'dark-background-color': 'color',
    'dark-color': 'color',
    'dark-icon-wrapped-url': 'string',
    'dark-icon-unwrapped-url': 'string',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-weight': 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
  }

  static defaultAttributes = {
    'font-size': '13px',
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

    // The title background and inherited border are both rendered on the
    // inner table, so emit one class for those table declarations.
    const tableDeclarations = []

    const darkBackgroundColor = this.getAttribute('dark-background-color')
    if (darkBackgroundColor) {
      tableDeclarations.push({
        cssProperty: 'background-color',
        cssValue: darkBackgroundColor,
      })
    }

    // Inherited from mj-accordion-element; title borders are rendered on the
    // inner table as border-bottom.
    const darkBorderColor = this.getAttribute('dark-border-color')
    if (darkBorderColor) {
      tableDeclarations.push({
        cssProperty: 'border-bottom-color',
        cssValue: darkBorderColor,
      })
    }

    this.darkClasses.table = this.registerDarkModeRuleGroup({
      cssDeclarations: tableDeclarations,
    })

    const darkColor = this.getAttribute('dark-color')
    if (darkColor) {
      this.darkClasses.color = registerDarkModeRule(globalData, {
        cssProperty: 'color',
        cssValue: darkColor,
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
        width: '100%',
        color: this.getAttribute('color'),
        'font-size': this.getAttribute('font-size'),
        'font-family': this.resolveFontFamily(),
        'font-weight': this.getAttribute('font-weight'),
        padding: this.getAttribute('padding'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-top': this.getAttribute('padding-top'),
      },
      table: {
        width: '100%',
        'background-color': this.getAttribute('background-color'),
        ...(this.getAttribute('border') !== 'none' && this.getAttribute('border') !== '0' && this.getAttribute('border') !== '0px' && { 'border-bottom': this.getAttribute('border') }),
      },
      td2: {
        padding: '16px',
        'vertical-align': this.getAttribute('icon-align'),
      },
      img: {
        display: 'none',
        width: this.getAttribute('icon-width'),
        height: this.getAttribute('icon-height'),
      },
    }
  }

  renderIconImage(lightSrc, alt, darkSrc, toggleClass) {
    const img = `<img
          ${this.htmlAttributes({
            src: lightSrc,
            alt,
            class: toggleClass,
            style: 'img',
          })}
        />`

    if (!darkSrc) {
      return img
    }

    return `<picture>
            <source ${this.htmlAttributes({
              srcset: darkSrc,
              media: '(prefers-color-scheme: dark)',
            })} />
            ${img}
          </picture>`
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
    return MjAccordionTitle.defaultAttributes.fontFamily
  }

  renderTitle() {
    const colorDarkClass = this.getDarkClasses().color

    return `
      <td
        ${this.htmlAttributes({
          class: [this.getAttribute('css-class'), colorDarkClass]
            .filter(Boolean)
            .join(' ') || undefined,
          style: 'td',
        })}
      >
        ${this.getContent()}
      </td>`
  }

  renderIcons() {
    return conditionalTag(
      `
      <td
        ${this.htmlAttributes({
          class: 'mj-accordion-ico',
          style: 'td2',
        })}
      >
        ${this.renderIconImage(
          this.getAttribute('icon-wrapped-url'),
          this.getAttribute('icon-wrapped-alt'),
          this.getAttribute('dark-icon-wrapped-url'),
          'mj-accordion-more',
        )}
        ${this.renderIconImage(
          this.getAttribute('icon-unwrapped-url'),
          this.getAttribute('icon-unwrapped-alt'),
          this.getAttribute('dark-icon-unwrapped-url'),
          'mj-accordion-less',
        )}
      </td>
    `,
      true,
    )
  }

  render() {
    const tableDarkClass = this.getDarkClasses().table

    const contentElements = [this.renderTitle(), this.renderIcons()]
    const content = (
      this.getAttribute('icon-position') === 'right'
        ? contentElements
        : contentElements.reverse()
    ).join('\n')

    return `
      <div ${this.htmlAttributes({ class: 'mj-accordion-title' })}>
        <table
          ${this.htmlAttributes({
            cellspacing: '0',
            cellpadding: '0',
            class: tableDarkClass || undefined,
            style: 'table',
          })}
        >
          <tr>
            ${content}
          </tr>
        </table>
      </div>`
  }
}
