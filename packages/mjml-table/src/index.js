import { MJMLElement } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-table'
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
    'cellpadding': '0',
    'cellspacing': '0',
    'color': '#000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px',
    'table-layout': 'auto',
    'width': '100%'
  }
}
const endingTag = true

@MJMLElement
class Table extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return {
      table: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size'), "px"),
        lineHeight: defaultUnit(mjAttribute('line-height'), "px"),
        tableLayout: mjAttribute('table-layout')
      }
    }
  }

  render () {
    const { mjAttribute, mjContent } = this.props

    return (
      <table
        cellPadding={mjAttribute('cellPadding')}
        cellSpacing={mjAttribute('cellSpacing')}
        dangerouslySetInnerHTML={{__html: mjContent() }}
        data-legacy-border="0"
        style={this.styles.table}
        width={mjAttribute('width')} />
    )
  }

}

Table.tagName = tagName
Table.defaultMJMLDefinition = defaultMJMLDefinition
Table.endingTag = endingTag

export default Table
