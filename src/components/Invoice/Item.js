import MJMLElement from '../decorators/MJMLElement'
import React, { Component } from 'react'
import _ from 'lodash'

@MJMLElement({
  tagName: 'mj-invoice-item',
  content: ' ',

  attributes: {
    'name': '',
    'price': 0,
    'quantity': 0,

    'color': '#747474',
    'font-family': 'Roboto, Ubuntu, Helvetica, Arial, sans-serif',
    'padding': '10px 20px',
    'font-size': '14px',
    'text-align': 'left'
  }
})
class InvoiceItem extends Component {

  static baseStyles = {
    td: {
      fontWeight: 500,
      lineHeight: 1
    },
    name: { wordBreak: 'break-all' },
    quantity: { textAlign: 'right' }
  }

  getStyles() {
    const { mjAttribute } = this.props

    const styles = _.merge({}, this.constructor.baseStyles, {
      td: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        padding: mjAttribute('padding'),
        fontSize: mjAttribute('font-size'),
        textAlign: mjAttribute('text-align')
      }
    })

    styles.name     = _.merge({}, styles.td, styles.name)
    styles.quantity = _.merge({}, styles.td, styles.quantity)

    return styles
  }

  render() {
    this.styles = this.getStyles()

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

export default InvoiceItem
