import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-html'
const parentTag = ['mj-column']
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': null,
    'container-background-color': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '0px',
    'vertical-align': null
  }
}
const baseStyles = {
  div: {
    fontSize: '13px'
  }
}
const schemaXsd = () => (
  `<xs:complexType name="${tagName}">
    <xs:simpleContent>
      <xs:sequence>
        <xs:any processContents="skip" minOccurs="0"/>
      </xs:sequence>
      <xs:extension base="xs:string">
        ${Object.keys(defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
      </xs:extension>
    </xs:simpleContent>
  </xs:complexType>`
)

@MJMLElement
class Html extends Component {

  styles = this.getStyles()

  getStyles () {
    return merge({}, baseStyles, {})
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

Html.tagName = tagName
Html.parentTag = parentTag
Html.endingTag = endingTag
Html.defaultMJMLDefinition = defaultMJMLDefinition
Html.baseStyles = baseStyles
Html.schemaXsd = schemaXsd

export default Html
