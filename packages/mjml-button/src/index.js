import { BodyComponent } from 'mjml-core'

export default class MjButton extends BodyComponent {
  static endingTag = true

  static allowedAttributes = [
    'align',
    'background-color',
    'border-bottom',
    'border-left',
    'border-radius',
    'border-right',
    'border-top',
    'border',
    'color',
    'container-background-color',
    'font-family',
    'font-size',
    'font-style',
    'font-weight',
    'height',
    'href',
    'inner-padding',
    'line-height',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
    'padding',
    'rel',
    'text-decoration',
    'text-transform',
    'vertical-align',
    'width',
  ]

  static defaultAttributes = {
    align: 'center',
    'background-color': '#414141',
    border: 'none',
    'border-radius': '3px',
    color: '#ffffff',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'font-weight': 'normal',
    'inner-padding': '10px 25px',
    'line-height': '120%',
    padding: '10px 25px',
    'text-decoration': 'none',
    'text-transform': 'none',
    'vertical-align': 'middle',
  }

  getStyles() {
    return {
      table: {
        'border-collapse': 'separate',
        width: this.getAttribute('width'),
        // Ensure that wrong line-height wouldn't be inherited
        'line-height': '100%',
      },
      td: {
        border: this.getAttribute('border'),
        'border-bottom': this.getAttribute('border-bottom'),
        'border-left': this.getAttribute('border-left'),
        'border-radius': this.getAttribute('border-radius'),
        'border-right': this.getAttribute('border-right'),
        'border-top': this.getAttribute('border-top'),
        color: this.getAttribute('color'),
        cursor: 'auto',
        'font-style': this.getAttribute('font-style'),
        height: this.getAttribute('height'),
        padding: this.getAttribute('inner-padding'),
      },
      content: {
        background: this.getAttribute('background-color'),
        color: this.getAttribute('color'),
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'font-style': this.getAttribute('font-style'),
        'font-weight': this.getAttribute('font-weight'),
        'line-height': this.getAttribute('line-height'),
        Margin: '0',
        'text-decoration': this.getAttribute('text-decoration'),
        'text-transform': this.getAttribute('text-transform'),
      },
    }
  }

  render() {
    const tag = this.getAttribute('href') ? 'a' : 'p'

    return `
      <table
        ${this.htmlAttributes({
    align: this.getAttribute('align'),
    border: '0',
    cellpadding: '0',
    cellspacing: '0',
    role: 'presentation',
    style: 'table',
  })}
      >
        <tr>
          <td
            ${this.htmlAttributes({
    align: 'center',
    bgcolor: this.getAttribute('background-color') === 'none' ? undefined : this.getAttribute('background-color'),
    role: 'presentation',
    style: 'td',
    valign: this.getAttribute('vertical-align'),
  })}
          >
            <${tag}
              ${this.htmlAttributes({
    href: this.getAttribute('href'),
    rel: this.getAttribute('rel'),
    style: 'content',
    target: tag === 'a' ? '_blank' : undefined,
  })}
            >
              ${this.getContent()}
            </${tag}>
          </td>
        </tr>
      </table>
    `
  }
}
