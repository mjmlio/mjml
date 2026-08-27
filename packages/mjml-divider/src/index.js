import { BodyComponent } from 'mjml-core'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjDivider extends BodyComponent {
  static componentName = 'mj-divider'

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'aria-hidden': 'string',
    'border-color': 'color',
    'border-color--dark': 'color',
    'border-style': 'string',
    'border-width': 'unit(px)',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
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

    const darkContainerBg = this.attributes['container-background-color--dark']
    if (darkContainerBg) {
      this.darkClasses.container = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      })
    }

    const darkBorderColor = this.attributes['border-color--dark']
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
    const tableHr = {
      'border-top': ['style', 'width', 'color']
        .map((attr) => this.getAttribute(`border-${attr}`))
        .join(' '),
      margin: computeAlign,
      width: this.getAttribute('width'),
      'max-width': '100%',
    }

    const hr = {
      border: '0',
      'border-top': ['style', 'width', 'color']
        .map((attr) => this.getAttribute(`border-${attr}`))
        .join(' '),
      background: '0',
      height: '0',
      margin: computeAlign,
      'max-width': this.getAttribute('width'),
    }

    return {
      hr,
      tableHr,
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
          ...(this.getAttribute('aria-hidden') === 'true'
            ? {
                'aria-hidden': 'true',
              }
            : {}),
          border: '0',
          cellpadding: '0',
          class: borderDarkClass,
          cellspacing: '0',
          style: 'tableHr',
          role: 'none',
          width: typeof this.getAttribute('width') === 'string' ? this.getAttribute('width').replace(/px$/, '') : this.getAttribute('width'),
        })}
      >
        <tr>
          <td><hr style="border:0;background:0;height:0;margin:0;" noshade width="0" /></td>
        </tr>
      </table>
    `
    }

    return `
      <hr
        ${this.htmlAttributes({
          ...(this.getAttribute('aria-hidden') === 'true'
            ? {
                'aria-hidden': 'true',
              }
            : {}),
          class: borderDarkClass,
          style: 'hr',
        })}
      />
    `
  }
}
