import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-invoice-item'
const defaultMJMLDefinition = {
  attributes: {
    'color': '#747474',
    'font-family': 'Roboto, Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '14px',
    'name': '',
    'padding': '10px 20px',
    'price': '0',
    'quantity': '0',
    'text-align': 'left'
  }
}
const endingTag = true
const baseStyles = {
  td: {
    fontWeight: '500',
    lineHeight: '1'
  },
  name: {
    wordBreak: 'break-all'
  },
  quantity: {
    textAlign: 'right'
  }
}

@MJMLElement
class InvoiceItem extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    const styles = merge({}, baseStyles, {
      td: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        padding: mjAttribute('padding'),
        textAlign: mjAttribute('text-align')
      }
    })

    styles.name = merge({}, styles.td, styles.name)
    styles.quantity = merge({}, styles.td, styles.quantity)

    return styles
  }

  render () {
    const { mjAttribute } = this.props

    return (
      <tr>
        <td style={this.styles.name}>{mjAttribute('name')}</td>
        <td style={this.styles.td}>{mjAttribute('price')}</td>
        <td style={this.styles.quantity}>{mjAttribute('quantity')}</td>
      </tr>
    )
  }

}

InvoiceItem.tagName = tagName
InvoiceItem.defaultMJMLDefinition = defaultMJMLDefinition
InvoiceItem.endingTag = endingTag
InvoiceItem.baseStyles = baseStyles

export default InvoiceItem
