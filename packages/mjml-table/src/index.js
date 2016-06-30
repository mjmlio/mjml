import { MJMLElement } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-table'
const parentTag = 'mj-column'
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
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
const schemaXsd = () => (
  `<xs:complexType name="${tagName}">
    <xs:complexContent>
      <xs:extension base="xs:any">
        ${Object.keys(defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>`
)

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
        lineHeight: defaultUnit(mjAttribute('line-height')),
        tableLayout: mjAttribute('table-layout')
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

Table.tagName = tagName
Table.parentTag = parentTag
Table.endingTag = endingTag
Table.defaultMJMLDefinition = defaultMJMLDefinition
Table.schemaXsd = schemaXsd

export default Table
