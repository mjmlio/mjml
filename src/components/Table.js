import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'

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

  styles = this.getStyles()

  getStyles () {
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

  render () {
    const { mjAttribute, mjContent } = this.props

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        dangerouslySetInnerHTML={{__html: mjContent() }}
        data-legacy-border="0"
        style={this.styles.table}
        width={mjAttribute('width')} />
    )
  }

}

export default Table
