import _ from 'lodash'
import { widthParser } from '../helpers/mjAttribute'
import MJMLElement from './decorators/MJMLElement'
import React, { Component } from 'react'

/**
 * Columns are the basic containers for your content. They must be located under mj-section tags in order to be considered by the engine
 */
@MJMLElement({
  tagName: 'mj-column'
})
class Column extends Component {

  static baseStyles = {
    div: {
      verticalAlign: 'top'
    }
  }

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      div: {
        display: 'inline-block',
        verticalAlign: mjAttribute('vertical-align'),
        fontSize: '13',
        textAlign: 'left',
        width: '100%',
        minWidth: mjAttribute('width')
      },
      table: {
        verticalAlign: mjAttribute('vertical-align'),
        background: mjAttribute('background-color')
      }
    })
  }

  getColumnClass () {
    const { mjAttribute, sibling } = this.props
    const width = mjAttribute('width')

    if (width == undefined) {
      return `mj-column-per-${parseInt(100 / sibling)}`
    }

    const { width: parsedWidth, unit } = widthParser(width)

    switch (unit) {
      case '%':
        return `mj-column-per-${parsedWidth}`

      case 'px':
      default:
        return `mj-column-px-${parsedWidth}`
    }
  }

  render () {
    const { mjAttribute, children, sibling } = this.props
    const width = mjAttribute('width') || (100 / sibling)
    const mjColumnClass = this.getColumnClass()

    return (
      <div
        aria-labelledby={mjColumnClass}
        className={mjColumnClass}
        data-column-width={parseInt(width)}
        data-vertical-align={this.styles.div.verticalAlign}
        style={this.styles.div}>
        <table
          cellPadding="0"
          cellSpacing="0"
          data-legacy-background={mjAttribute('background')}
          data-legacy-border="0"
          style={this.styles.table}
          width="100%">
          <tbody>
            {children}
          </tbody>
        </table>
      </div>
    )
  }

}

export default Column
