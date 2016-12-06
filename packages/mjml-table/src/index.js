import { MJMLElement } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-table'
const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
    'cellpadding': '0',
    'cellspacing': '0',
    'color': '#000',
    'container-background-color': null,
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'table-layout': 'auto',
    'vertical-align': null,
    'width': '100%'
  }
}

@MJMLElement
class Table extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return {
      table: {
        cellpadding: mjAttribute('cellspadding'),
        cellspacing: mjAttribute('cellspacing'),
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size')),
        lineHeight: mjAttribute('line-height'),
        tableLayout: mjAttribute('table-layout')
      }
    }
  }

  render () {
    const { mjAttribute, mjContent } = this.props

    return (
      <table
        cellPadding={mjAttribute('cellpadding')}
        cellSpacing={mjAttribute('cellspacing')}
        dangerouslySetInnerHTML={{__html: mjContent() }}
        data-legacy-border="0"
        style={this.styles.table}
        width={mjAttribute('width')} />
    )
  }

}

Table.tagName = tagName
Table.parentTag = parentTag
Table.endingTag = endingTag
Table.defaultMJMLDefinition = defaultMJMLDefinition

export default Table
