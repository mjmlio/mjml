import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-text'
const parentTag = 'mj-column'
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
    'color': '#000000',
    'container-background-color': null,
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'vertical-align': null
  }
}
const baseStyles = {
  div: {
    cursor: 'auto'
  }
}
const schemaXsd = () => (
  `<xs:complexType name="${tagName}">
    <xs:simpleContent>
      <xs:extension base="xs:string">
        ${Object.keys(defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
      </xs:extension>
    </xs:simpleContent>
  </xs:complexType>`
)

@MJMLElement
class Text extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return merge({}, baseStyles, {
      div: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size')),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: defaultUnit(mjAttribute('line-height'), "px"),
        textDecoration: mjAttribute('text-decoration'),
        textTransform: mjAttribute('text-transform')
      }
    })
  }

  render () {
    const { mjContent } = this.props

    return (
      <div
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        style={this.styles.div} />
    )
  }

}

Text.tagName = tagName
Text.parentTag = parentTag
Text.endingTag = endingTag
Text.defaultMJMLDefinition = defaultMJMLDefinition
Text.baseStyles = baseStyles
Text.schemaXsd = schemaXsd

export default Text
