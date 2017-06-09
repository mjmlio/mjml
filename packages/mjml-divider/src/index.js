import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class extends BodyComponent {

  static tagName = 'mj-divider'

  static tagOmission = true

  static defaultAttributes = {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    padding: '10px 25px',
    width: '100%',
  }

  getStyles() {
    return {
      div: {
        'border-top': `${this.getAttribute('border-width')} ${this.getAttribute('border-style')} ${this.getAttribute('border-color')}`,
        'font-size': 1,
        margin: '0px auto',
        width: this.getAttribute('width'),
      },
    }
  }

  getOutlookWidth() {
    const {
      columnWidth,
    } = this.context

    const width = this.getAttribute('width')

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
  }

  renderAfter() {
    return `
      <!--[if mso | IE]>
        <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="${this.styles('p')}" width="${this.getOutlookWidth()}"><tr><td style="height:0;line-height:0;">&nbsp;</td></tr></table>
      <![endif]-->
    `
  }

  render() {
    return `
      <p
        ${this.htmlAttributes({
          style: 'p',
        })}
      >
      </p>
      ${this.renderAfter()}
    `
  }

}
