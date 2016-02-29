import MJMLColumnElement from '../decorators/MJMLColumnElement'
import React, { Component } from 'react'
import _ from 'lodash'
import numeral from 'numeral'

import MJTable from '../Table'

@MJMLColumnElement({
  tagName: 'mj-invoice',

  attributes: {
    'color': '#b9b9b9',
    'font-family': 'Roboto, Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'border': '1px solid #ecedee',

    'intl': 'name:Name;price:Price;quantity:Quantity'
  }
})
class Invoice extends Component {

  constructor(props) {
    super(props)

    const format     = props.mjAttribute('format')
    const currencies = format.match(/([^-\d.,])/g)

    this.items    = props.mjChildren().filter((child) => child.get('tagName') === 'mj-invoice-item')
    this.format   = format.replace(/([^-\d.,])/g, '$')
    this.currency = (currencies) ? currencies[0] : null
  }

  static baseStyles = {
    th: {
      padding: '10px 20px',
      fontWeight: 700,
      textTransform: 'uppercase',
      textAlign: 'left'
    }
  }

  static intl = {
    name    : 'Name',
    price   : 'Price',
    quantity: 'Quantity',
    total   : 'Total:'
  }

  getStyles() {
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
        padding: '10px 20px',
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        fontWeight: 700,
        lineHeight: mjAttribute('line-height'),
        textAlign: 'right'
      }
    })

    styles.thQuantity = _.merge({}, styles.th, { textAlign: 'right' })

    return styles
  }

  getAttributes() {
    const { mjAttribute } = this.props

    return {
      table: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        lineHeight: mjAttribute('line-height')
      }
    }
  }

  getIntl() {
    const { mjAttribute } = this.props

    const intl = _.cloneDeep(this.constructor.intl)

    mjAttribute('intl').split(';').forEach((t) => {
      if (t && t.indexOf(':') != -1) {
        t = t.split(':')
        intl[t[0].trim()] = t[1].trim()
      }
    })

    return intl
  }

  getTotal() {
    const format   = this.format
    const currency = this.currency
    const total    = this.items.reduce((prev, item) => {
      const unitPrice = parseFloat(numeral().unformat(item.getIn(['attributes', 'price'])))
      const quantity  = parseInt(item.getIn(['attributes', 'quantity']))

      return prev + unitPrice * quantity
    }, 0)

    return numeral(total).format(format).replace(/([^-\d.,])/g, currency)
  }

  render() {
    const { renderChildren } = this.props

    const intl   = this.getIntl()
    const styles = this.getStyles()
    const attrs  = this.getAttributes()

    const total  = this.getTotal()

    return (
      <MJTable {...attrs.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>{intl['name']}</th>
            <th style={styles.th}>{intl['price']}</th>
            <th style={styles.thQuantity}>{intl['quantity']}</th>
          </tr>
        </thead>
        {renderChildren()}
        <tfoot>
          <tr style={styles.tfoot}>
            <th style={styles.th} colSpan="2">{intl['total']}</th>
            <td style={styles.total}>{total}</td>
          </tr>
        </tfoot>
      </MJTable>
    )
  }
}

export default Invoice
