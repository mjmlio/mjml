import MJMLElement from './decorators/MJMLElement'
import React, { Component } from 'react'
import _ from 'lodash'
import  { widthParser } from '../helpers/mjAttribute'

/**
 * Sections are intended to be used as rows within your email. They will be used to structure the layout.
 */
@MJMLElement({
  tagName: 'mj-group'
})
class Group extends Component {

  static baseStyles = {
    td: {
      border: 'none',
      borderSpacing: '0'
    },
    div: {
      verticalAlign: "top"
    }
  };

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      div: {
        display: "inline-block",
        verticalAlign: mjAttribute('vertical-align'),
        fontSize: "13",
        textAlign: "left",
        width: "100%",
        minWidth: mjAttribute('width')
      },
      table: {
        background: mjAttribute('background-color')
      }
    })
  }

  getColumnClass() {
    const { mjAttribute, sibling } = this.props
    const width = mjAttribute('width')

    if (width == undefined) {
      return `mj-column-per-${parseInt(100/sibling)}`
    }

    const { width: parsedWidth, unit } = widthParser(width)

    switch(unit) {
      case '%':
        return `mj-column-per-${parsedWidth}`

      case 'px':
      default:
        return `mj-column-px-${parsedWidth}`
    }
  }

  renderChildren() {
    const { renderChildren } = this.props
    let i = -1

    // Put every children in a td to have everything on the same line
    return renderChildren().map(child => {
      return (
        <td key={++i}>
          {child}
        </td>
      )
    })
  }

  render() {
    const { mjAttribute, sibling } = this.props
    const width = mjAttribute('width') || (100 / sibling)
    const mjColumnClass = this.getColumnClass()

    this.styles = this.getStyles()

    return (
      <div style={this.styles.div} className={mjColumnClass} aria-labelledby={mjColumnClass} data-column-width={parseInt(width)}>
        <table style={this.styles.table} data-legacy-background={mjAttribute('background')} width="100%">
          <tbody>
          <tr>
            {this.renderChildren()}
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default Group
