import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-button'
const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    "background-color": "#414141",
    "border": "none",
    "border-bottom": null,
    "border-left": null,
    "border-radius": "3px",
    "border-right": null,
    "border-top": null,
    "container-background-color": null,
    "font-style": null,
    "font-size": "13px",
    "font-weight": "normal",
    "font-family": "Ubuntu, Helvetica, Arial, sans-serif",
    "color": "#ffffff",
    "text-decoration": "none",
    "text-transform": "none",
    "align": "center",
    "vertical-align": "middle",
    "href": null,
    "rel": null,
    "inner-padding": "10px 25px",
    'padding': '10px 25px',
    "padding-top": null,
    "padding-bottom": null,
    "padding-left": null,
    "padding-right": null,
    "width": null,
    "height": null
  }
}
const baseStyles = {
  table: {
    borderCollapse: 'separate'
  },
  a: {
    textDecoration: 'none',
    lineHeight: '100%'
  }
}

@MJMLElement
class Button extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return helpers.merge({}, baseStyles, {
      table: {
        width: mjAttribute('width')
      },
      innerTable: {
        border: '0',
        margin: '0 auto',
        padding: defaultUnit(mjAttribute('inner-padding'), "px")
      },
      td: {
        background: mjAttribute('background-color'),
        border: mjAttribute('border'),
        borderBottom: mjAttribute('border-bottom'),
        borderLeft: mjAttribute('border-left'),
        borderRight: mjAttribute('border-right'),
        borderRadius: defaultUnit(mjAttribute('border-radius'), "px"),
        borderTop: mjAttribute('border-top'),
        height: mjAttribute('height'),
        width: mjAttribute('width')
      },
      a: {
        display: 'inline-block',
        color: mjAttribute('color'),
        cursor: 'auto',
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size')),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        height: mjAttribute('height'),
        textDecoration: mjAttribute('text-decoration'),
        textTransform: mjAttribute('text-transform'),
        margin: "0px",
        padding: defaultUnit(mjAttribute('inner-padding'), "px")
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
          rel={mjAttribute('rel')}
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
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        data-legacy-align={mjAttribute('align')}
        data-legacy-border="0"
        style={this.styles.table}>
        <tbody>
          <tr>
            <td>
              <table
                cellSpacing="0"
                cellPadding="0"
                style={this.styles.innerTable}>
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

export default Button
