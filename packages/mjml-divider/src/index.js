import { BodyComponent } from 'mjml-core'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
  registerResponsivePaddingGroup,
} from 'mjml-core/lib/helpers/responsiveMode'

function computeAlignMargin(align) {
  if (align === 'left') return '0px'
  if (align === 'right') return '0px 0px 0px auto'
  return '0px auto'
}

export default class MjDivider extends BodyComponent {
  static componentName = 'mj-divider'

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'align--responsive': 'enum(left,center,right)',
    'aria-hidden': 'string',
    'border-color': 'color',
    'border-color--dark': 'color',
    'border-style': 'string',
    'border-width': 'unit(px)',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
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
    width: 'unit(px,%)',
    'width--responsive': 'unit(px,%)',
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

  responsiveClasses = null

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

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) return this.responsiveClasses

    this.responsiveClasses = {
      container: null,
      table: null,
      hr: null,
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses.container = registerResponsivePaddingGroup(globalData, this.attributes)

    const alignResponsive = this.attributes['align--responsive']
    const widthResponsive = this.attributes['width--responsive']

    if (alignResponsive || widthResponsive) {
      const computedMargin = alignResponsive ? computeAlignMargin(alignResponsive) : null

      this.responsiveClasses.table = registerResponsiveRuleGroup(globalData, {
        cssDeclarations: buildResponsiveDeclarations([
          ['width', widthResponsive],
          ['margin', computedMargin],
        ]),
      })

      this.responsiveClasses.hr = registerResponsiveRuleGroup(globalData, {
        cssDeclarations: buildResponsiveDeclarations([
          ['max-width', widthResponsive],
          ['margin', computedMargin],
        ]),
      })
    }

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
    const { table: tableResponsiveClass, hr: hrResponsiveClass } = this.getResponsiveClasses()

    if (supportOutlookClassic) {
      return `
      <table
        ${this.htmlAttributes({
          'aria-hidden': this.getAttribute('aria-hidden'),
          border: '0',
          cellpadding: '0',
          class: [borderDarkClass, tableResponsiveClass].filter(Boolean).join(' ') || undefined,
          cellspacing: '0',
          style: 'tableHr',
          role: 'none',
          width: typeof this.getAttribute('width') === 'string' ? this.getAttribute('width').replace(/px$/, '') : this.getAttribute('width'),
        })}
      >
        <tr>
          <td><hr style="border:0;background:0;height:0;margin:0;" noshade /></td>
        </tr>
      </table>
    `
    }

    return `
      <hr
        ${this.htmlAttributes({
          'aria-hidden': this.getAttribute('aria-hidden'),
          class: [borderDarkClass, hrResponsiveClass].filter(Boolean).join(' ') || undefined,
          style: 'hr',
        })}
      />
    `
  }
}
