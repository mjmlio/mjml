import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import min from 'lodash/min'
import React, { Component } from 'react'

const tagName = 'mj-image'
const defaultMJMLDefinition = {
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
}
const endingTag = true
const baseStyles = {
  table: {
    borderCollapse: 'collapse',
    borderSpacing: '0px'
  },
  img: {
    border: 'none',
    display: 'block',
    outline: 'none',
    textDecoration: 'none',
    width: '100%'
  }
}

@MJMLElement
class Image extends Component {

  styles = this.getStyles()

  getContentWidth () {
    const { mjAttribute, getPadding } = this.props
    const parentWidth = mjAttribute('parentWidth')

    const width = min([parseInt(mjAttribute('width')), parseInt(parentWidth)])

    const paddingRight = getPadding('right')
    const paddingLeft = getPadding('left')
    const widthOverflow = paddingLeft + paddingRight + width - parseInt(parentWidth)

    return widthOverflow > 0 ? width - widthOverflow : width
  }

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, baseStyles, {
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
        height={mjAttribute('height')}
        src={mjAttribute('src')}
        style={this.styles.img}
        width={this.getContentWidth()} />
    )

    if (mjAttribute('href') != '') {
      return (
        <a
          href={mjAttribute('href')}
          target={mjAttribute('target')}>
          {img}
        </a>
      )
    }

    return img
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

Image.tagName = tagName
Image.defaultMJMLDefinition = defaultMJMLDefinition
Image.endingTag = endingTag
Image.baseStyles = baseStyles

export default Image
