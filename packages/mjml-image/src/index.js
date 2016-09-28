import { MJMLElement, helpers } from 'mjml-core'
import min from 'lodash/min'
import React, { Component } from 'react'

const tagName = 'mj-image'
const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const selfClosingTag = true
const defaultMJMLDefinition = {
  attributes: {
    'align': 'center',
    'alt': '',
    'border': 'none',
    'border-radius': '',
    'container-background-color': null,
    'height': 'auto',
    'href': '',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'src': '',
    'target': '_blank',
    'title': '',
    'vertical-align': null,
    'width': null
  }
}
const baseStyles = {
  table: {
    borderCollapse: 'collapse',
    borderSpacing: '0px'
  },
  img: {
    border: 'none',
    borderRadius: '',
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

    const width = mjAttribute('width') ? min([parseInt(mjAttribute('width')), parseInt(parentWidth)]) : parseInt(parentWidth)

    const paddingRight = getPadding('right')
    const paddingLeft = getPadding('left')
    const widthOverflow = paddingLeft + paddingRight + width - parseInt(parentWidth)

    return widthOverflow > 0 ? width - widthOverflow : width
  }

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return helpers.merge({}, baseStyles, {
      td: {
        width: defaultUnit(this.getContentWidth())
      },
      img: {
        border: mjAttribute('border'),
        height: mjAttribute('height'),
        borderRadius: defaultUnit(mjAttribute('border-radius'), "px")
      }
    })
  }

  renderImage () {
    const { mjAttribute } = this.props

    const img = (
      <img
        alt={mjAttribute('alt')}
        title={mjAttribute('title')}
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
        role="presentation"
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
Image.parentTag = parentTag
Image.endingTag = endingTag
Image.selfClosingTag = selfClosingTag
Image.defaultMJMLDefinition = defaultMJMLDefinition
Image.baseStyles = baseStyles

export default Image
