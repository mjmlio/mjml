import MJMLElement from './MJMLElement'
import React, { Component } from 'react'
import _ from 'lodash'

/**
 * Columns are the basic containers for your content. They must be located under mj-section tags in order to be considered by the engine
 */
@MJMLElement({
  tagName: 'mj-column'
})
class Column extends Component {

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
        minWidth: mjAttribute('width')
      }
    })
  }

  getColumnClass() {
    const { mjAttribute, sibling } = this.props
    let width = mjAttribute('width')

    if (width == undefined) {
      return `mj-${sibling}column`
    }

    const widthUnit = /[0-9]+([^ ,\)`]*)/.exec(width)[1]
    width = parseInt(width)

    switch(widthUnit) {
    case '%':
      return `mj-column-per-${width}`

    case 'px':
    default:
      return `mj-column-px-${width}`
    }
  }

  render() {
    const { mjAttribute, renderChildren } = this.props
    const width = mjAttribute('width')
    const mjColumnClass = this.getColumnClass()

    this.styles = this.getStyles()

    return (
      <div style={this.styles.div} className={mjColumnClass} aria-labelledby={mjColumnClass} data-column-width={parseInt(width)}>
        <table
          width="100%">
          <tbody>
            {renderChildren()}
          </tbody>
        </table>
      </div>
    )
  }

}

export default Column
