import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'
import _ from 'lodash'

@MJMLColumnElement({
  tagName: 'mj-table',
  content: '',
  attributes: {
    'align': 'left',
    'color': '#000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px',
    'width': '100%'
  }
})
class Table extends Component {

  static baseStyles = {}

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      table: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        lineHeight: mjAttribute('line-height')
      }
    })
  }

  render() {
    this.styles = this.getStyles()

    const { mjAttribute, mjContent } = this.props

    return (
      <table
        border="0"
        cellPadding="0"
        cellSpacing="0"
        dangerouslySetInnerHTML={{__html: mjContent() }}
        style={this.styles.table}
        width={mjAttribute('width')} />
    )
  }
}

export default Table
