import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import min from 'lodash/min'
import React, { Component } from 'react'

const tagName = 'mj-image'
const parentTag = 'mj-column'
const endingTag = true
const closingTag = false
const defaultMJMLDefinition = {
  attributes: {
    'align': 'center',
    'alt': '',
    'border': 'none',
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
    'vertical-align': null
  }
}
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
const schemaXsd = () => (
  `<xs:complexType name="${tagName}">
    ${Object.keys(defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
  </xs:complexType>`
)

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
    const { mjAttribute, defaultUnit } = this.props

    return merge({}, baseStyles, {
      td: {
        width: defaultUnit(this.getContentWidth())
      },
      img: {
        border: mjAttribute('border'),
        height: defaultUnit(mjAttribute('height'))
      }
    })
  }

  renderImage () {
    const { mjAttribute, defaultUnit } = this.props

    const img = (
      <img
        alt={mjAttribute('alt')}
        border="0"
        height={defaultUnit(mjAttribute('height'))}
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
Image.parentTag = parentTag
Image.endingTag = endingTag
Image.closingTag = closingTag
Image.defaultMJMLDefinition = defaultMJMLDefinition
Image.baseStyles = baseStyles
Image.schemaXsd = schemaXsd

export default Image
