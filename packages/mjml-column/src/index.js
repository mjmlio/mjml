import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-column'
const baseStyles = {
  div: {
    verticalAlign: 'top'
  }
}

@MJMLElement
class Column extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, this.constructor.baseStyles, {
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

Column.tagName = tagName
Column.baseStyles = baseStyles

export default Column
