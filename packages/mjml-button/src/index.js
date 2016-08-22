import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-button'
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'center',
    'background-color': '#414141',
    'border-radius': '3px',
    'color': '#ffffff',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'font-weight': 'normal',
    'href': '',
    'padding': '10px 25px',
    'inner-padding': '10px 25px',
    'text-decoration': 'none',
    'vertical-align': 'middle'
  }
}
const endingTag = true
const baseStyles = {
  table: {
    borderCollapse: 'separate'
  },
  a: {
    display: 'inline-block',
    textDecoration: 'none'
  }
}

@MJMLElement
class Button extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return merge({}, baseStyles, {
      td: {
        border: mjAttribute('border'),
        borderRadius: defaultUnit(mjAttribute('border-radius'), "px"),
        color: mjAttribute('color'),
        cursor: 'auto',
        fontStyle: mjAttribute('font-style'),
        padding: defaultUnit(mjAttribute('inner-padding'), "px")
      },
      a: {
        background: mjAttribute('background-color'),
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size'), "px"),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('height'),
        textDecoration: mjAttribute('text-decoration'),
        textTransform: mjAttribute('text-transform'),
        margin: "0px"
      }
    })
  }

  renderButton () {
    const { mjContent, mjAttribute } = this.props

    if (mjAttribute('href')) {
      return (
        <a
          dangerouslySetInnerHTML={{ __html: mjContent() }}
          href={mjAttribute('href')}
          style={this.styles.a}
          target="_blank" />
      )
    }

    return (
      <p
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        style={this.styles.a} />
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
              data-legacy-bgcolor={mjAttribute('background-color') === "none" ? "" : mjAttribute('background-color')}
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
Button.defaultMJMLDefinition = defaultMJMLDefinition
Button.endingTag = endingTag
Button.baseStyles = baseStyles

export default Button
