import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-button', {
  endingTag: true,
  allowedAttributes: {
    'background-color': '#414141',
    border: 'none',
    'border-bottom': null,
    'border-left': null,
    'border-radius': '3px',
    'border-right': null,
    'border-top': null,
    'container-background-color': null,
    'font-style': null,
    'font-size': '13px',
    'font-weight': 'normal',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    color: '#ffffff',
    'text-decoration': 'none',
    'text-transform': 'none',
    align: 'center',
    'vertical-align': 'middle',
    href: null,
    rel: null,
    'inner-padding': '10px 25px',
    'line-height': '120%',
    padding: '10px 25px',
    'padding-top': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    width: null,
    height: null,
  },
  defaultAttributes: {
    'background-color': '#414141',
    border: 'none',
    'border-radius': '3px',
    'font-size': '13px',
    'font-weight': 'normal',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    color: '#ffffff',
    'text-decoration': 'none',
    'text-transform': 'none',
    align: 'center',
    'vertical-align': 'middle',
    'inner-padding': '10px 25px',
    'line-height': '120%',
    padding: '10px 25px',
  },
  getStyles() {
    return {
      table: {
        'border-collapse': 'separate',
        width: this.getMjAttribute('width'),
      },
      td: {
        border: this.getMjAttribute('border'),
        'border-bottom': this.getMjAttribute('border-bottom'),
        'border-left': this.getMjAttribute('border-left'),
        'border-radius': this.getMjAttribute('border-radius'),
        'border-right': this.getMjAttribute('border-right'),
        'border-top': this.getMjAttribute('border-top'),
        color: this.getMjAttribute('color'),
        cursor: 'auto',
        'font-style': this.getMjAttribute('font-style'),
        height: this.getMjAttribute('height'),
        padding: this.getMjAttribute('inner-padding'),
      },
      content: {
        background: this.getMjAttribute('background-color'),
        color: this.getMjAttribute('color'),
        'font-family': this.getMjAttribute('font-family'),
        'font-size': this.getMjAttribute('font-size'),
        'font-style': this.getMjAttribute('font-style'),
        'font-weight': this.getMjAttribute('font-weight'),
        'line-height': this.getMjAttribute('line-height'),
        'text-decoration': this.getMjAttribute('text-decoration'),
        'text-transform': this.getMjAttribute('text-transform'),
        Margin: '0px',
      },
    }
  },
  render() {
    const tag = this.getMjAttribute('href') ? 'a' : 'p'

    return `
      <table
        ${this.generateHtmlAttributes({
          align: this.getMjAttribute('align'),
          border: '0',
          cellPadding: '0',
          cellSpacing: '0',
          role: 'presentation',
          style: 'table',
        })}
      >
        <tr>
          <td
            ${this.generateHtmlAttributes({
              align: 'center',
              bgcolor: this.getMjAttribute('background-color') === 'none' ? undefined : this.getMjAttribute('background-color'),
              role: 'presentation',
              style: 'td',
              valign: this.getMjAttribute('vertical-align'),
            })}
          >
            <${tag}
              ${this.generateHtmlAttributes({
                href: this.getMjAttribute('href'),
                rel: this.getMjAttribute('rel'),
                style: 'content',
                target: tag == 'a' ? '_blank' : undefined,
              })}
            >
              ${this.getMjContent()}
            </${tag}>
          </td>
        </tr>
      </table>
    `
  },
})
