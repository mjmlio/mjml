import { BodyComponent } from 'mjml-core'

export default class MjAccordion extends BodyComponent {
  static componentName = 'mj-accordion'

  static allowedAttributes = {
    'container-background-color': 'color',
    border: 'string',
    'font-family': 'string',
    'icon-align': 'enum(top,middle,bottom)',
    'icon-width': 'unit(px,%)',
    'icon-height': 'unit(px,%)',
    'icon-wrapped-url': 'string',
    'icon-wrapped-alt': 'string',
    'icon-unwrapped-url': 'string',
    'icon-unwrapped-alt': 'string',
    'icon-position': 'enum(left,right)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
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
    const childrenAttr = [
      'border',
      'icon-align',
      'icon-width',
      'icon-height',
      'icon-position',
      'icon-wrapped-url',
      'icon-wrapped-alt',
      'icon-unwrapped-url',
      'icon-unwrapped-alt',
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
          class: 'mj-accordion',
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
