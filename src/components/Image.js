import _ from 'lodash'
import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'

/**
 * Displays an image to your email. It is mostly similar to the HTML img tag
 */
@MJMLColumnElement({
  tagName: 'mj-image',
  attributes: {
    'height': 'auto',
    'padding': '10px 25px',
    'align': 'center',
    'alt': '',
    'border': 'none',
    'href': '',
    'src': '',
    'target': '_blank'
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
      width: '100%'
    }
  }

  styles = this.getStyles()

  getContentWidth () {
    const { mjAttribute, getPadding } = this.props
    const parentWidth = mjAttribute('parentWidth')

    const width = _.min([parseInt(mjAttribute('width')), parseInt(parentWidth)])

    const paddingRight = getPadding('right')
    const paddingLeft = getPadding('left')
    const widthOverflow = paddingLeft + paddingRight + width - parseInt(parentWidth)

    return widthOverflow > 0 ? width - widthOverflow : width
  }

  getStyles () {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      td: {
        width: this.getContentWidth()
      },
      img: {
        border: mjAttribute('border'),
        height: mjAttribute('height')
      }
    })
  }

  renderImage () {
    const { mjAttribute } = this.props

    const img = (
      <img
        alt={mjAttribute('alt')}
        border="0"
        src={mjAttribute('src')}
        style={this.styles.img}
        width={this.getContentWidth()}
        height={this.styles.img.height} />
    )

    if (mjAttribute('href') != '') {
      return (
        <a href={mjAttribute('href')} target={mjAttribute('target')}>
          {img}
        </a>
      )
    }
    else {
      return img
    }
  }

  render () {
    const { mjAttribute } = this.props

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        data-legacy-align={mjAttribute('align')}
        data-legacy-border="0"
        style={this.styles.table}>
        <tbody>
          <tr>
            <td style={this.styles.td}>
              {this.renderImage()}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

}

export default Image
