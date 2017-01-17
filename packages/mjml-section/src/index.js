import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-section', {
  attributes: {
    direction: 'ltr',
    padding: '20px 0',
    'text-align': 'center',
    'vertical-align': 'top',
  },
  getStyles () {
    const {
      containerWidth,
    } = this.context

    return {
      div: {
        'max-width': containerWidth,
        margin: '0px auto',
      },
      table: {
        'font-size': '0px',
        width: '100%',
      },
      td: {
        direction: this.getMjAttribute('direction'),
        'font-size': '0px',
        padding: this.getMjAttribute('padding'),
        'padding-bottom': this.getMjAttribute('padding-bottom'),
        'padding-left': this.getMjAttribute('padding-left'),
        'padding-right': this.getMjAttribute('padding-right'),
        'padding-top': this.getMjAttribute('padding-top'),
        'text-align': 'center',
        'vertical-align': 'top',
      },
    }
  },
  renderBefore () {
    const {
      containerWidth,
    } = this.context

    return `
      <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${parseFloat(containerWidth)}" align="center" style="width:${containerWidth};">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    `
  },
  renderAfter () {
    return `
      <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
    `
  },
  render () {
    return `
      ${this.renderBefore()}
      <div
        ${this.generateHtmlAttributes({
          style: this.generateStyles('div'),
        })}
      >
        <table
          ${this.generateHtmlAttributes({
            align: 'center',
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
            style: this.generateStyles('table'),
          })}
        >
          <tbody>
            <tr>
              <td
                ${this.generateHtmlAttributes({
                  style: this.generateStyles('td'),
                })}
              >
                ${this.renderChildren()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      ${this.renderAfter()}
    `
  }
})
