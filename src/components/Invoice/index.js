import _ from 'lodash'
import MJMLElement from '../decorators/MJMLElement'
import MJTable from '../Table'
import numeral from 'numeral'
import React, { Component } from 'react'

@MJMLElement({
  tagName: 'mj-invoice',
  attributes: {
    'border': '1px solid #ecedee',
    'color': '#b9b9b9',
    'font-family': 'Roboto, Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'intl': 'name:Name;price:Price;quantity:Quantity',
    'line-height': '22px'
  }
})
class Invoice extends Component {

  static baseStyles = {
    th: {
      fontWeight: 700,
      padding: '10px 20px',
      textAlign: 'left',
      textTransform: 'uppercase'
    }
  }

  static intl = {
    name: 'Name',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total:'
  }

  constructor (props) {
    super(props)

    const format = props.mjAttribute('format')
    const currencies = format.match(/([^-\d.,])/g)

    this.items = props.mjml.get('children').filter(child => child.get('tagName') === 'mj-invoice-item')
    this.format = format.replace(/([^-\d.,])/g, '$')
    this.currency = currencies[0] || null
  }

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    const styles = _.merge({}, this.constructor.baseStyles, {
      table: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        lineHeight: mjAttribute('line-height')
      },
      th: {
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        lineHeight: mjAttribute('line-height')
      },
      thead: {
        borderBottom: mjAttribute('border')
      },
      tfoot: {
        borderTop: mjAttribute('border')
      },
      total: {
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        fontWeight: 700,
        lineHeight: mjAttribute('line-height'),
        padding: '10px 20px',
        textAlign: 'right'
      }
    })

    styles.thQuantity = _.merge({}, styles.th, { textAlign: 'right' })

    return styles
  }

  getIntl () {
    const { mjAttribute } = this.props

    const intl = _.cloneDeep(this.constructor.intl)

    mjAttribute('intl').split(';').forEach(t => {
      if (t && t.indexOf(':') != -1) {
        t = t.split(':')
        intl[t[0].trim()] = t[1].trim()
      }
    })

    return intl
  }

  getTotal () {
    const format = this.format
    const currency = this.currency

    const total = this.items.reduce((prev, item) => {
      const unitPrice = parseFloat(numeral().unformat(item.getIn(['attributes', 'price'])))
      const quantity = parseInt(item.getIn(['attributes', 'quantity']))

      return prev + unitPrice * quantity
    }, 0)

    return numeral(total).format(format).replace(/([^-\d.,])/g, currency)
  }

  render () {
    const { children } = this.props
    const intl = this.getIntl()
    const total = this.getTotal()

    return (
      <MJTable {...this.props}>
        <thead>
          <tr style={this.styles.thead}>
            <th style={this.styles.th}>{intl['name']}</th>
            <th style={this.styles.th}>{intl['price']}</th>
            <th style={this.styles.thQuantity}>{intl['quantity']}</th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
        <tfoot>
          <tr style={this.styles.tfoot}>
            <th
               colSpan="2"
              style={this.styles.th}>{intl['total']}</th>
            <td style={this.styles.total}>{total}</td>
          </tr>
        </tfoot>
      </MJTable>
    )
  }

}

export default Invoice
