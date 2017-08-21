import min from 'lodash/min'

import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjImage extends BodyComponent {

  static tagOmission = true

  static defaultAttributes = {
    align: 'center',
    border: '0',
    height: 'auto',
    padding: '10px 25px',
    target: '_blank',
  }

  getStyles() {
    const width = this.getContentWidth()
    const fullWidth = this.getAttribute('full-width') === 'full-width'

    const {
      parsedWidth,
      unit,
    } = widthParser(width)

    return {
      img: {
        'border': this.getAttribute('border'),
        'display': 'block',
        'outline': 'none',
        'text-decoration': 'none',
        'min-width': fullWidth ? '100%' : null,
        'width': fullWidth ? `${parsedWidth}${unit}` : '100%',
        'max-width': fullWidth ? '100%' : null,
      },
      td: {
        'width': fullWidth ? null : `${parsedWidth}${unit}`,
      },
      table: {
        'min-width': fullWidth ? '100%' : null,
        'max-width': fullWidth ? '100%' : null,
        'width': fullWidth ? `${parsedWidth}${unit}` : null,
        'border-collapse': 'collapse',
        'border-spacing': '0px',
      },
    }
  }

  getContentWidth() {
    const {
      containerWidth,
    } = this.context

    const width = this.getAttribute('width')
       ? min([
         parseInt(this.getAttribute('width')),
         containerWidth,
       ])
      : containerWidth

    const paddingRight = this.getShorthandAttrValue('padding', 'right')
    const paddingLeft = this.getShorthandAttrValue('padding', 'left')
    const widthOverflow = paddingLeft + paddingRight + parseFloat(width) - parentWidth

    return widthOverflow > 0
      ? parseFloat(width - widthOverflow)
      : parseFloat(width)
  }

  renderImage() {
    const img = `
      <img
        ${this.htmlAttributes({
          alt: this.getAttribute('href'),
          height: this.getAttribute('height'),
          src: this.getAttribute('src'),
          style: 'img',
          title: this.getAttribute('title'),
          width: this.getContentWidth(),
        })}
      />
    `

    if (this.getAttribute('href')) {
      return `
        <a
          ${this.htmlAttributes({
            href: this.getAttribute('href'),
            target: this.getAttribute('target'),
          })}
        >
          ${img}
        </a>
      `
    }

    return img
  }

  render() {
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
        <tbody>
          <tr>
            <td ${this.htmlAttributes({ style: 'td' })}>
              ${this.renderImage()}
            </td>
          </tr>
        </tbody>
      </table>
    `
  }

}
