import { BodyComponent } from 'mjml-core'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjAccordion extends BodyComponent {
  static componentName = 'mj-accordion'

  static allowedAttributes = {
    border: 'string',
    'container-background-color': 'color',
    'dark-border-color': 'color',
    'dark-container-background-color': 'color',
    'dark-icon-wrapped-url': 'string',
    'dark-icon-unwrapped-url': 'string',
    'font-family': 'string',
    'icon-align': 'enum(top,middle,bottom)',
    'icon-height': 'unit(px,%)',
    'icon-position': 'enum(left,right)',
    'icon-width': 'unit(px,%)',
    'icon-wrapped-url': 'string',
    'icon-wrapped-alt': 'string',
    'icon-unwrapped-url': 'string',
    'icon-unwrapped-alt': 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
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
      return [base, containerDarkClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
  }

  headStyle = () =>
    `
      noinput.mj-accordion-checkbox { display:block!important; }

      @media yahoo, only screen and (min-width:0) {
        input.mj-accordion-checkbox + * .mj-accordion-title { cursor:pointer; touch-action:manipulation; -webkit-user-select:none; -moz-user-select:none; user-select:none; }
        input.mj-accordion-checkbox + * .mj-accordion-content { overflow:hidden; display:none; }
        
        input.mj-accordion-checkbox, .mj-accordion-less,
        input.mj-accordion-checkbox:checked + * .mj-accordion-more { display:none!important; }

        .mj-accordion-element,
        input.mj-accordion-checkbox + * .mj-accordion-more,
        input.mj-accordion-checkbox:checked + * .mj-accordion-content,
        input.mj-accordion-checkbox:checked + * .mj-accordion-less { display:block!important; }
      }
      .moz-text-html input.mj-accordion-checkbox + * .mj-accordion-title { cursor: auto; touch-action: auto; -webkit-user-select: auto; -moz-user-select: auto; user-select: auto; }
      .moz-text-html input.mj-accordion-checkbox + * .mj-accordion-content { overflow: hidden; display: block; }
      .moz-text-html input.mj-accordion-checkbox + * .mj-accordion-ico { display: none; }
      /* prettier-ignore */
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
      'dark-border-color',
      'icon-align',
      'icon-width',
      'icon-height',
      'icon-position',
      'icon-wrapped-url',
      'icon-wrapped-alt',
      'icon-unwrapped-url',
      'icon-unwrapped-alt',
      'dark-icon-wrapped-url',
      'dark-icon-unwrapped-url',
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
        })}
      >
        ${this.renderChildren(this.props.children, {
          attributes: childrenAttr,
        })}
      </table>
      `
  }
}
