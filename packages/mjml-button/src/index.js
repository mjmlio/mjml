import {MJMLElement, helpers} from 'mjml-core'
import React, {Component} from 'react'

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
    "inner-padding": "10px 25px",
    "padding": '10px 25px',
    "padding-top": null,
    "padding-bottom": null,
    "padding-left": null,
    "padding-right": null,
    "width": null,
    "height": null,
    "box-shadow": "none",
    "line-height": "16px",
    "text-align": "center"
  }
}
const baseStyles = {
  tableRoot: {
    borderCollapse: 'collapse',
    borderSpacing: '0',
    padding: '0',
    textAlign: 'left'
  },
  trRoot: {
    padding: '0',
    textAlign: 'left',
    verticalAlign: 'top'
  },
  tdRoot: {
    padding: '0',
    borderCollapse: 'collapse',
    textAlign: 'left',
    verticalAlign: 'top'
  },
  containerTable: {
    width: '100%'
  },
  containerTr: {
    padding: 0,
    textAlign: 'left'
  },
  containerTd: {
    border: 'none',
    borderCollapse: 'collapse',
    hyphens: 'auto',
    MozHyphens: 'auto',
    padding: '0',
    WebkitHyphens: 'auto',
    wordWrap: 'break-word'
  },
  buttonA: {
    display: 'block',
    textTransform: 'none'
  },
  buttonTable: {
    borderCollapse: 'separate',
    width: '100%'
  },
  buttonP: {
    margin: '0',
    padding: '0'
  }
}

@MJMLElement
class Button extends Component {

  styles = this.getStyles()

  getStyles () {
    const {mjAttribute} = this.props,
      width = mjAttribute('width'),
      isWidthPerCent = width && width.indexOf('%') >= 0

    return helpers.merge({}, baseStyles, {
      tableRoot: {
        width: isWidthPerCent ? width : null
      },
      tdRoot: {
        backgroundColor: mjAttribute('container-background-color'),
        width: isWidthPerCent ? null : width
      },
      containerTd: {
        color: mjAttribute('color'),
        backgroundColor: mjAttribute('container-background-color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        textAlign: mjAttribute('text-align'),
        width: mjAttribute('width')
      },
      buttonA: {
        textDecoration: mjAttribute('text-decoration')
      },
      buttonP: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        textAlign: mjAttribute('text-align')
      },
      buttonTd: {
        backgroundColor: mjAttribute('background-color'),
        border: mjAttribute('border'),
        borderBottom: mjAttribute('border-bottom'),
        borderLeft: mjAttribute('border-left'),
        borderRadius: mjAttribute('border-radius'),
        borderRight: mjAttribute('border-right'),
        borderTop: mjAttribute('border-top'),
        boxShadow: mjAttribute('box-shadow'),
        height: mjAttribute('height'),
        padding: mjAttribute('inner-padding'),
        verticalAlign: mjAttribute('vertical-align')
      }
    })
  }

  renderButton () {
    const {mjContent, mjAttribute} = this.props
    if (mjAttribute('href')) {
      return (
        <a href={mjAttribute('href')} style={this.styles.buttonA} target="_blank">
          <table style={this.styles.buttonTable}>
            <tbody>
              <tr>
                <td style={this.styles.buttonTd}>
                  <p dangerouslySetInnerHTML={{__html: mjContent()}} style={this.styles.buttonP} />
                </td>
              </tr>
            </tbody>
          </table>
        </a>)
    }
    return (
      <table style={this.styles.buttonTable}>
        <tbody>
          <tr>
            <td style={this.styles.buttonTd}>
              <p dangerouslySetInnerHTML={{__html: mjContent()}} style={this.styles.buttonP} />
            </td>
          </tr>
        </tbody>
      </table>)
  }

  render () {
    const {mjAttribute} = this.props
    return (
      <table
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        align={mjAttribute('align')}
        data-legacy-align={mjAttribute('align')}
        data-legacy-border="0"
        style={this.styles.tableRoot}>
        <tbody>
          <tr style={this.styles.trRoot}>
            <td style={this.styles.tdRoot}>
              <table
                cellPadding="0"
                cellSpacing="0"
                style={this.styles.containerTable}>
                <tbody>
                  <tr style={this.styles.containerTr}>
                    <td style={this.styles.containerTd}>
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
