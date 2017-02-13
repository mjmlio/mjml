import _ from 'lodash'

import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default createBodyComponent('mj-image', {
  tagOmission: true,
  defaultAttributes: {
    align: 'center',
    border: '0',
    height: 'auto',
    padding: '10px 25px',
    target: '_blank',
  },
  getStyles () {
    const width = this.getContentWidth()
    const {
      parsedWidth,
      unit,
    } = widthParser(width)

    return {
      img: {
        border: this.getMjAttribute('border'),
        display: 'block',
        outline: 'none',
        'text-decoration': 'none',
        width: '100%',
      },
      td: {
        width: `${parsedWidth}${unit}`,
      },
      table: {
        'border-collapse': 'collapse',
        'border-spacing': '0px',
      },
    }
  },
  getContentWidth () {
    const {
      columnWidth,
    } = this.context

    const width = this.getMjAttribute('width') ?
      _.min( [
        parseInt(this.getMjAttribute('width')),
        columnWidth,
      ] ) :
      columnWidth

    const paddingRight = this.getPadding('right')
    const paddingLeft = this.getPadding('left')
    const widthOverflow = paddingLeft + paddingRight + parseFloat(width) - columnWidth

    return widthOverflow > 0 ?
      parseFloat(width - widthOverflow) :
      parseFloat(width)
  },
  renderImage () {
    const img = `
      <img
        ${this.generateHtmlAttributes({
          alt: this.getMjAttribute('href'),
          height: this.getMjAttribute('height'),
          src: this.getMjAttribute('src'),
          style: this.generateStyles('img'),
          title: this.getMjAttribute('title'),
          width: this.getContentWidth(),
        })}
      />
    `

    if (this.getMjAttribute('href')) {
      return `
        <a
          ${this.generateHtmlAttributes({
            href: this.getMjAttribute('href'),
            target: this.getMjAttribute('target'),
          })}
        >
          ${img}
        </a>
      `
    }

    return img
  },
  render () {
    return `
      <table
        ${this.generateHtmlAttributes({
          align: this.getMjAttribute('align'),
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
              ${this.renderImage()}
            </td>
          </tr>
        </tbody>
      </table>
    `
  }
})
