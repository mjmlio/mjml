import { BodyComponent } from 'mjml-core'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  registerResponsivePaddingGroup,
} from 'mjml-core/lib/helpers/responsiveMode'

export default class MjAccordion extends BodyComponent {
  static componentName = 'mj-accordion'

  static allowedAttributes = {
    'aria-label': 'string',
    'aria-roledescription': 'string',
    border: 'string',
    'border-color--dark': 'color',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
    'font-family': 'string',
    'icon-align': 'enum(top,middle,bottom)',
    'icon-height': 'unit(px,%)',
    'icon-height--responsive': 'unit(px,%)',
    'icon-position': 'enum(left,right)',
    'icon-width': 'unit(px,%)',
    'icon-width--responsive': 'unit(px,%)',
    'icon-wrapped-url': 'string',
    'icon-wrapped-url--dark': 'string',
    'icon-wrapped-alt': 'string',
    'icon-unwrapped-url': 'string',
    'icon-unwrapped-url--dark': 'string',
    'icon-unwrapped-alt': 'string',
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
    role: 'string',
  }

  static defaultAttributes = {
    border: '2px solid black',
    'font-family': 'Ubuntu, sans-serif',
    'icon-wrapped-url': 'https://i.imgur.com/bIXv1bk.png',
    'icon-wrapped-alt': '+',
    'icon-unwrapped-url': 'https://i.imgur.com/w4uTygT.png',
    'icon-unwrapped-alt': '-',
    'icon-position': 'right',
    'icon-height': '32px',
    'icon-width': '32px',
    padding: '10px 25px',
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
        cssProperty: 'border-color',
        cssValue: darkBorderColor,
      })
    }

    return this.darkClasses
  }

  // container-background-color is rendered on the wrapper <td> by the core
  // renderer, so merge the dark container class into css-class.
  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const containerDarkClass = this.getDarkClasses().container
      const containerResponsiveClass = this.getResponsiveClasses().container
      return [base, containerDarkClass, containerResponsiveClass]
        .filter(Boolean)
        .join(' ') || undefined
    }

    return this.attributes[name]
  }

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) {
      return this.responsiveClasses
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses = {
      container: registerResponsivePaddingGroup(globalData, this.attributes),
    }

    return this.responsiveClasses
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    emitResponsiveHeadStyle(this.context && this.context.globalData)
    return ''
  }

  headStyle = () =>
    `
      noinput.mj-accordion-checkbox { display:block!important; }

      @media only screen and (min-width:0) {
        .mj-accordion-element { display:block; }
        .mj-accordion-checkbox[type="checkbox"] { display:block!important; position: absolute; opacity:0; pointer-events:none; }
        .mj-accordion-checkbox[type="checkbox"]:focus-visible ~ div .mj-accordion-title { outline: 5px auto Highlight; outline-color:-webkit-focus-ring-color; }
        .mj-accordion-less { display:none!important; }
        .mj-accordion-checkbox[type="checkbox"] + * .mj-accordion-title { cursor:pointer; touch-action:manipulation; -webkit-user-select:none; -moz-user-select:none; user-select:none; }
        .mj-accordion-checkbox[type="checkbox"] + * .mj-accordion-content { overflow:hidden; display:none; }
        .mj-accordion-checkbox[type="checkbox"] + * .mj-accordion-more { display:block!important; }
        .mj-accordion-checkbox:checked + * .mj-accordion-content { display:block; }
        .mj-accordion-checkbox:checked + * .mj-accordion-more { display:none!important; }
        .mj-accordion-checkbox:checked + * .mj-accordion-less { display:block!important; }
      }
      .moz-text-html input.mj-accordion-checkbox + * .mj-accordion-title { cursor: auto; touch-action: auto; -webkit-user-select: auto; -moz-user-select: auto; user-select: auto; }
      .moz-text-html input.mj-accordion-checkbox + * .mj-accordion-content { overflow: hidden; display: block; }
      .moz-text-html input.mj-accordion-checkbox + * .mj-accordion-ico { display: none; }
      
      @goodbye { @gmail }
    `

  getStyles() {
    return {
      table: {
        width: '100%',
        'border-collapse': 'collapse',
        border: this.getAttribute('border'),
        ...(this.getAttribute('border') !== 'none' && this.getAttribute('border') !== '0' && this.getAttribute('border') !== '0px' && { 'border-bottom': '0' }),
      },
    }
  }

  getChildContext() {
    return {
      ...this.context,
      accordionFontFamily: this.getAttribute('font-family'),
    }
  }

  render() {
    const borderDarkClass = this.getDarkClasses().border

    const childrenAttr = [
      'border',
      'border-color--dark',
      'icon-align',
      'icon-height',
      'icon-height--responsive',
      'icon-position',
      'icon-unwrapped-alt',
      'icon-unwrapped-url',
      'icon-unwrapped-url--dark',
      'icon-width',
      'icon-width--responsive',
      'icon-wrapped-alt',
      'icon-wrapped-url',
      'icon-wrapped-url--dark',
    ].reduce(
      (res, val) => ({
        ...res,
        [val]: this.getAttribute(val),
      }),
      {},
    )

    return `
      <table
        ${this.htmlAttributes({
          cellspacing: '0',
          cellpadding: '0',
          class: ['mj-accordion', borderDarkClass].filter(Boolean).join(' '),
          style: 'table',
          role: this.getAttribute('role'),
          'aria-label': this.getAttribute('aria-label'),
          'aria-roledescription': this.getAttribute('aria-roledescription'),
        })}
      >
        ${this.renderChildren(this.props.children, {
          attributes: childrenAttr,
        })}
      </table>
      `
  }
}
