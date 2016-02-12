import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'
import _ from 'lodash'

/**
 * Displays an image to your email. It is mostly similar to the HTML img tag
 */
@MJMLColumnElement({
  tagName: 'mj-image',
  attributes: {
    'height': 'auto',
    'padding-bottom': '10px',
    'padding-left': '25px',
    'padding-right': '25px',
    'padding-top': '10px',
    'align': 'center',
    'alt': '',
    'border': 'none',
    'href': '',
    'src': ''
  }
})
class Image extends Component {

  static baseStyles = {
    table: {
      borderCollapse: 'collapse',
      borderSpacing: '0'
    },
    img: {
      border: 'none',
      display: 'block',
      outline: 'none',
      textDecoration: 'none',
      width: "100%"
    }
  };

  getContentWidth() {
    const { mjAttribute } = this.props
    const width = _.min([parseInt(mjAttribute('width')), parseInt(mjAttribute('parentWidth'))])
    const paddingRight = parseInt(mjAttribute('padding-left')) || 0
    const paddingLeft = parseInt(mjAttribute('padding-right')) || 0
    const widthOverflow = paddingLeft + paddingRight + width - parseInt(mjAttribute('parentWidth'))

    return widthOverflow > 0 ? width - widthOverflow : width
  }

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      img: {
        border: mjAttribute('border'),
        maxWidth: this.getContentWidth(),
        height: mjAttribute('height')
      }
    })
  }

  renderImage() {
    const { mjAttribute } = this.props

    const img = (
      <img
        alt={mjAttribute('alt')}
        border="0"
        src={mjAttribute('src')}
        style={this.styles.img}
        width={this.styles.img.maxWidth}
        height={this.styles.img.height} />
    )

    if (mjAttribute('href') != '') {
      return (
        <a href={mjAttribute('href')}>
          {img}
        </a>
      )
    }
    else {
      return img
    }
  }

  render() {
    const { mjAttribute } = this.props

    this.styles = this.getStyles()

    return (
      <table
        border="0"
        cellPadding="0"
        cellSpacing="0"
        data-legacy-align={mjAttribute('align')}
        style={this.styles.table}>
        <tbody>
          <tr>
            <td>
              {this.renderImage()}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

}

export default Image
