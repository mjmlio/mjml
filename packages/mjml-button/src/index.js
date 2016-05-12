import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-button'
const parentTag = 'mj-column'
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'center',
    'background-color': '#414141',
    'border-radius': '3px',
    'border': 'none',
    'color': '#ffffff',
    'container-background-color': null,
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'font-weight': 'normal',
    'href': '',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'text-decoration': 'none',
    'vertical-align': 'middle'
  }
}
const baseStyles = {
  a: {
    display: 'inline-block',
    textDecoration: 'none'
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
class Button extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return merge({}, baseStyles, {
      td: {
        background: mjAttribute('background-color'),
        borderRadius: defaultUnit(mjAttribute('border-radius')),
        color: mjAttribute('color'),
        cursor: 'auto',
        fontStyle: mjAttribute('font-style')
      },
      table: {
        border: mjAttribute('border'),
        borderRadius: defaultUnit(mjAttribute('border-radius'))
      },
      a: {
        background: mjAttribute('background-color'),
        border: `1px solid ${mjAttribute('background-color')}`,
        borderRadius: defaultUnit(mjAttribute('border-radius')),
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size')),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        padding: defaultUnit(mjAttribute('padding')),
        textDecoration: mjAttribute('text-decoration')
      }
    })
  }

  renderButton () {
    const { mjContent, mjAttribute } = this.props

    return (
      <a
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        href={mjAttribute('href')}
        style={this.styles.a}
        target="_blank" />
    )
  }

  render () {
    const { mjAttribute } = this.props

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        data-legacy-align={mjAttribute('align')}
        data-legacy-border="0"
        style={this.styles.table}>
        <tbody>
          <tr>
            <td
              data-legacy-align="center"
              data-legacy-bgcolor={mjAttribute('background-color')}
              data-legacy-valign={mjAttribute('vertical-align')}
              style={this.styles.td}>
              {this.renderButton()}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

}

Button.tagName = tagName
Button.parentTag = parentTag
Button.endingTag = endingTag
Button.defaultMJMLDefinition = defaultMJMLDefinition
Button.baseStyles = baseStyles
Button.schemaXsd = schemaXsd

export default Button
