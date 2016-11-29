import { MJMLElement, helpers } from 'mjml-core'
import cloneDeep from 'lodash/cloneDeep'
import MJMLTable from 'mjml-table'
import numeral from 'numeral'
import omit from 'lodash/omit'
import React, { Component } from 'react'

const tagName = 'mj-invoice'
const parentTag = ['mj-column']
const defaultMJMLDefinition = {
  attributes: {
    'align': null,
    'border': '1px solid #ecedee',
    'color': '#b9b9b9',
    'container-background-color': null,
    'font-family': 'Roboto, Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'format': null,
    'intl': 'name:Name;price:Price;quantity:Quantity',
    'padding': null,
    'padding-top': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'line-height': '22px'
  }
}
const baseStyles = {
  th: {
    fontWeight: '700',
    padding: '10px 20px',
    textAlign: 'left',
    textTransform: 'uppercase'
  }
}
const intl = {
  name: 'Name',
  price: 'Price',
  quantity: 'Quantity',
  total: 'Total:'
}

@MJMLElement
class Invoice extends Component {

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
    const { mjAttribute, defaultUnit } = this.props

    const styles = helpers.merge({}, baseStyles, {
      table: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size'), "px"),
        lineHeight: mjAttribute('line-height')
      },
      th: {
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size'), "px"),
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
        fontSize: defaultUnit(mjAttribute('font-size'), "px"),
        fontWeight: '700',
        lineHeight: mjAttribute('line-height'),
        padding: '10px 20px',
        textAlign: 'right'
      }
    })

    styles.thQuantity = helpers.merge({}, styles.th, { textAlign: 'right' })

    return styles
  }

  getIntlValue () {
    const { mjAttribute } = this.props

    const intlValue = cloneDeep(intl)

    mjAttribute('intl').split(';').forEach(t => {
      if (t && t.indexOf(':') != -1) {
        t = t.split(':')
        intlValue[t[0].trim()] = t[1].trim()
      }
    })

    return intlValue
  }

  getTotal () {
    const format = this.format
    const currency = this.currency

    const total = this.items.reduce((prev, item) => {
      const unitPrice = parseFloat(numeral().unformat(item.getIn(['attributes', 'price']))) || 0
      const quantity = parseInt(item.getIn(['attributes', 'quantity'])) || 1

      return prev + unitPrice * quantity
    }, 0)

    return numeral(total).format(format).replace(/([^-\d.,])/g, currency)
  }

  render () {
    const { children } = this.props
    const intlValue = this.getIntlValue()
    const total = this.getTotal()
    return (
      <MJMLTable {...omit(this.props, 'columnElement')}>
        <thead>
          <tr style={this.styles.thead}>
            <th style={this.styles.th}>
              {intlValue['name']}
            </th>
            <th style={this.styles.th}>
              {intlValue['price']}
            </th>
            <th style={this.styles.thQuantity}>
              {intlValue['quantity']}
            </th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
        <tfoot>
          <tr style={this.styles.tfoot}>
            <th
              colSpan="2"
              style={this.styles.th}>
              {intlValue['total']}
            </th>
            <td style={this.styles.total}>
              {total}
            </td>
          </tr>
        </tfoot>
      </MJMLTable>
    )
  }

}

Invoice.tagName = tagName
Invoice.defaultMJMLDefinition = defaultMJMLDefinition
Invoice.baseStyles = baseStyles
Invoice.intl = intl
Invoice.parentTag = parentTag

export default Invoice
