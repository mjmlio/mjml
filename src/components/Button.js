import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'
import _ from 'lodash'

/**
 * Displays a customizable button
 */
@MJMLColumnElement({
  tagName: 'mj-button',
  content: ' ',
  attributes: {
    'align': 'center',
    'background-color': '#414141',
    'border-radius': '3px',
    'border': 'none',
    'color': '#ffffff',
    'font-size': '13px',
    'font-weight': 'bold',
    'href': '',
    'padding': '15px 30px',
    'text-decoration': 'none',
    'vertical-align': 'middle'
  }
})
class Button extends Component {

  static baseStyles = {
    a: {
      display: 'inline-block',
      textDecoration: 'none'
    }
  };

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      td: {
        background: mjAttribute('background-color'),
        borderRadius: mjAttribute('border-radius'),
        color: mjAttribute('color'),
        fontStyle: mjAttribute('font-style'),
        cursor: "auto"
      },
      table: {
        backgroundColor: mjAttribute('container-background-color'),
        border: mjAttribute('border'),
        borderRadius: mjAttribute('border-radius')
      },
      a: {
        background: mjAttribute('background-color'),
        border: `1px solid ${mjAttribute('background-color')}`,
        borderRadius: mjAttribute('border-radius'),
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        padding: mjAttribute('padding'),
        textDecoration: mjAttribute('text-decoration')
      }
    })
  }

  renderButton() {
    const { mjContent, mjAttribute } = this.props

    return (
      <a
        className="mj-content"
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        href={mjAttribute('href')}
        style={this.styles.a}
        target="_blank" />
    )
  }

  render() {
    const { mjAttribute } = this.props

    this.styles = this.getStyles()

    return (
      <table
        border="0"
        cellPadding="0"
        cellSpacing="0"
        data-legacy-align={mjAttribute('align')}
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

export default Button
