import { BodyComponent } from 'mjml-core'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjDivider extends BodyComponent {
  static componentName = 'mj-divider'

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'border-color': 'color',
    'border-style': 'string',
    'border-width': 'unit(px)',
    'container-background-color': 'color',
    'dark-border-color': 'color',
    'dark-container-background-color': 'color',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    width: 'unit(px,%)',
  }

  static defaultAttributes = {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    padding: '10px 25px',
    width: '100%',
    align: 'center',
  }

  darkClasses = null

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
    if (darkBorderColor) {
      this.darkClasses.border = registerDarkModeRule(globalData, {
        cssProperty: 'border-top-color',
        cssValue: darkBorderColor,
      })
    }

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
    let computeAlign = '0px auto'
    if (this.getAttribute('align') === 'left') {
      computeAlign = '0px'
    } else if (this.getAttribute('align') === 'right') {
      computeAlign = '0px 0px 0px auto'
    }
    const p = {
      'border-top': ['style', 'width', 'color']
        .map((attr) => this.getAttribute(`border-${attr}`))
        .join(' '),
      'font-size': '1px',
      margin: computeAlign,
      width: this.getAttribute('width'),
      'max-width': '100%',
    }

    return {
      p,
      table: {
        ...p,
      },
    }
  }

  render() {
    const supportOutlookClassic =
      !this.context ||
      !this.context.globalData ||
      this.context.globalData.supportOutlookClassic !== false

    const borderDarkClass = this.getDarkClasses().border

    if (supportOutlookClassic) {
      return `
      <table
        ${this.htmlAttributes({
          align: this.getAttribute('align'),
          border: '0',
          cellpadding: '0',
          class: borderDarkClass,
          cellspacing: '0',
          style: 'table',
          role: 'none',
          width: typeof this.getAttribute('width') === 'string' ? this.getAttribute('width').replace(/px$/, '') : this.getAttribute('width'),
        })}
      >
        <tr>
          <td style="height:0;line-height:0;">
            &nbsp;
          </td>
        </tr>
      </table>
    `
    }

    return `
      <p
        ${this.htmlAttributes({
          class: borderDarkClass,
          style: 'p',
        })}
      >
      </p>
    `
  }
}
