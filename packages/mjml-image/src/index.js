import min from 'lodash/min'

import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjImage extends BodyComponent {
  static tagOmission = true

  static allowedAttributes = {
    alt: 'string',
    href: 'string',
    src: 'string',
    srcset: 'string',
    title: 'string',
    align: 'enum(left,center,right)',
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-right': 'string',
    'border-top': 'string',
    'border-radius': 'unit(px,%)',
    'container-background-color': 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    height: 'unit(px,%)',
    width: 'unit(px,%)',
  }

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
    const fixCentering =
      this.getAttribute('align') === 'center' ? { margin: '0px auto' } : {}

    const { parsedWidth, unit } = widthParser(width)

    return {
      img: {
        border: this.getAttribute('border'),
        'border-radius': this.getAttribute('border-radius'),
        display: 'block',
        outline: 'none',
        'text-decoration': 'none',
        'min-width': fullWidth ? '100%' : null,
        width: fullWidth ? `${parsedWidth}${unit}` : '100%',
        'max-width': fullWidth ? '100%' : null,
      },
      td: {
        width: fullWidth ? null : `${parsedWidth}${unit}`,
      },
      table: {
        'min-width': fullWidth ? '100%' : null,
        'max-width': fullWidth ? '100%' : null,
        width: fullWidth ? `${parsedWidth}${unit}` : null,
        'border-collapse': 'collapse',
        'border-spacing': '0px',
        ...fixCentering,
      },
    }
  }

  getContentWidth() {
    const { containerWidth } = this.context

    const width = this.getAttribute('width')
      ? min([
          parseInt(this.getAttribute('width'), 10),
          parseInt(containerWidth, 10),
        ])
      : parseInt(containerWidth, 10)

    const paddingRight = this.getShorthandAttrValue('padding', 'right')
    const paddingLeft = this.getShorthandAttrValue('padding', 'left')

    const widthOverflow =
      paddingLeft +
      paddingRight +
      parseFloat(width) -
      parseInt(containerWidth, 10)

    return widthOverflow > 0
      ? parseFloat(width - widthOverflow)
      : parseFloat(width)
  }

  renderImage() {
    const img = `
      <img
        ${this.htmlAttributes({
          alt: this.getAttribute('alt'),
          height: this.getAttribute('height'),
          src: this.getAttribute('src'),
          srcset: this.getAttribute('srcset'),
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
