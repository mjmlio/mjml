import { MJMLElement } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-spacer'
const parentTag = 'mj-column'
const closingTag = false
const defaultMJMLDefinition = {
  attributes: {
    'align': null,
    'container-background-color': null,
    'height': '20px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'vertical-align': null
  }
}
const schemaXsd = () => (
  `<xs:complexType name="${tagName}">
    ${Object.keys(defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
  </xs:complexType>`
)

@MJMLElement
class Spacer extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return {
      div: {
        fontSize: '1px',
        lineHeight: defaultUnit(mjAttribute('height'))
      }
    }
  }

  render () {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: '&nbsp;' }}
        style={this.styles.div} />
    )
  }

}

Spacer.tagName = tagName
Spacer.parentTag = parentTag
Spacer.closingTag = closingTag
Spacer.defaultMJMLDefinition = defaultMJMLDefinition
Spacer.schemaXsd = schemaXsd

export default Spacer
