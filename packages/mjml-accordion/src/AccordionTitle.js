import { BodyComponent } from 'mjml-core'
import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
} from 'mjml-core/lib/helpers/responsiveMode'

export default class MjAccordionTitle extends BodyComponent {
  static componentName = 'mj-accordion-title'

  static endingTag = true

  static allowedAttributes = {
    'background-color': 'color',
    'background-color--dark': 'color',
    color: 'color',
    'color--dark': 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-size--responsive': 'unit(px)',
    'font-weight': 'string',
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
  }

  static defaultAttributes = {
    'font-size': '16px',
    padding: '16px',
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

    // The title background and inherited border are both rendered on the
    // inner table, so emit one class for those table declarations.
    const tableDeclarations = []

    const darkBackgroundColor = this.getAttribute('background-color--dark')
    if (darkBackgroundColor) {
      tableDeclarations.push({
        cssProperty: 'background-color',
        cssValue: darkBackgroundColor,
      })
    }

    // Inherited from mj-accordion-element; title borders are rendered on the
    // inner table as border-bottom.
    const darkBorderColor = this.getAttribute('border-color--dark')
    if (darkBorderColor) {
      tableDeclarations.push({
        cssProperty: 'border-bottom-color',
        cssValue: darkBorderColor,
      })
    }

    this.darkClasses.table = this.registerDarkModeRuleGroup({
      cssDeclarations: tableDeclarations,
    })

    const darkColor = this.getAttribute('color--dark')
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
    emitResponsiveHeadStyle(this.context && this.context.globalData)
    return ''
  }

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) {
      return this.responsiveClasses
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses = {
      content: registerResponsiveRuleGroup(globalData, {
        cssDeclarations: buildResponsiveDeclarations([
          ['font-size', this.attributes['font-size--responsive']],
          ['padding', this.attributes['padding--responsive']],
          ['padding-top', this.attributes['padding-top--responsive']],
          ['padding-right', this.attributes['padding-right--responsive']],
          ['padding-bottom', this.attributes['padding-bottom--responsive']],
          ['padding-left', this.attributes['padding-left--responsive']],
        ]),
      }),
    }

    return this.responsiveClasses
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
    const iconResponsiveClass = this.context && this.context.accordionIconResponsiveClass
    const img = `<img
          ${this.htmlAttributes({
            src: lightSrc,
            alt,
            class: [toggleClass, iconResponsiveClass].filter(Boolean).join(' '),
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
    const contentResponsiveClass = this.getResponsiveClasses().content

    return `
      <td
        ${this.htmlAttributes({
          class: [
            this.getAttribute('css-class'),
            colorDarkClass,
            contentResponsiveClass,
          ]
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
          this.getAttribute('icon-wrapped-url--dark'),
          'mj-accordion-more',
        )}
        ${this.renderIconImage(
          this.getAttribute('icon-unwrapped-url'),
          this.getAttribute('icon-unwrapped-alt'),
          this.getAttribute('icon-unwrapped-url--dark'),
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
