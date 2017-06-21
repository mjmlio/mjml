import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default createBodyComponent('mj-divider', {
  tagOmission: true,
  defaultAttributes: {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    padding: '10px 25px',
    width: '100%',
  },
  getStyles() {
    return {
      div: {
        'border-top': `${this.getMjAttribute('border-width')} ${this.getMjAttribute('border-style')} ${this.getMjAttribute('border-color')}`,
        'font-size': '1px',
        margin: '0px auto',
        width: this.getMjAttribute('width'),
      },
    }
  },
  getOutlookWidth() {
    const {
      columnWidth,
    } = this.context

    const width = this.getMjAttribute('width')

    const {
      parsedWidth,
      unit,
    } = widthParser(width)

    switch (unit) {
      case '%':
        return `${columnWidth * parsedWidth / 100}%`

      default:
        return columnWidth
    }
  },
  renderAfter() {
    return `
    <!--[if mso | IE]>
      <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="${this.generateStyles('p')}" width="${this.getOutlookWidth()}"><tr><td style="height:0;line-height:0;">&nbsp;</td></tr></table>
    <![endif]-->
    `
  },
  render() {
    return `
      <p
        ${this.generateHtmlAttributes({
          style: 'p',
        })}
      >
      </p>
      ${this.renderAfter()}
    `
  },
})
