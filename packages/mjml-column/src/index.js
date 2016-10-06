import { MJMLElement, helpers } from 'mjml-core'
import cx from 'classnames'
import each from 'lodash/each'
import merge from 'lodash/merge'
import React, { Component } from 'react'
import uniq from 'lodash/uniq'

const tagName = 'mj-column'
const parentTag = ['mj-section', 'mj-group', 'mj-navbar']
const defaultMJMLDefinition = {
  attributes: {
    'background': null,
    'background-color': null,
    "border": null,
    "border-bottom": null,
    "border-left": null,
    "border-radius": null,
    "border-right": null,
    "border-top": null,
    'vertical-align': null,
    'width': null
  }
}
const baseStyles = {
  div: {
    verticalAlign: 'top'
  }
}
const postRender = $ => {
  const mediaQueries = []

  each({ 'mj-column-per': '%', 'mj-column-px': 'px' }, (unit, className) => {
    const columnWidths = []

    $(`[class*="${className}"]`).each(function () {
      columnWidths.push($(this).data('column-width'))
      $(this).removeAttr('data-column-width')
    })

    uniq(columnWidths).forEach(width => {
      const mediaQueryClass = `${className}-${width}`

      mediaQueries.push(`.${mediaQueryClass}, * [aria-labelledby="${mediaQueryClass}"] { width:${width}${unit}!important; }`)
    })
  })

  if (mediaQueries.length > 0) {
    const mediaQuery = `<style type="text/css">
  @media only screen and (min-width:480px) {
    ${mediaQueries.join('\n')}
  }
</style>\n`

    $('head').append(mediaQuery)
  }

  return $
}

@MJMLElement
class Column extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return merge({}, baseStyles, {
      div: {
        display: 'inline-block',
        direction: 'ltr',
        fontSize: '13px',
        textAlign: 'left',
        width: this.getMobileWidth()
      },
      table: {
        background: mjAttribute('background-color'),
        border: mjAttribute('border'),
        borderBottom: mjAttribute('border-bottom'),
        borderLeft: mjAttribute('border-left'),
        borderRadius: defaultUnit(mjAttribute('border-radius'), "px"),
        borderRight: mjAttribute('border-right'),
        borderTop: mjAttribute('border-top'),
        verticalAlign: mjAttribute('vertical-align')
      }
    })
  }

  getColumnClass () {
    const { mjAttribute, sibling } = this.props
    const width = mjAttribute('width')

    if (width == undefined) {
      return `mj-column-per-${parseInt(100 / sibling)}`
    }

    const { width: parsedWidth, unit } = helpers.widthParser(width)

    switch (unit) {
      case '%':
        return `mj-column-per-${parsedWidth}`

      case 'px':
      default:
        return `mj-column-px-${parsedWidth}`
    }
  }

  getMobileWidth () {
    const { mjAttribute, sibling, parentWidth, mobileWidth } = this.props
    const width = mjAttribute('width')

    if (mobileWidth != "mobileWidth" ) {
      return '100%'
    } else if (width == undefined) {
      return `${parseInt(100 / sibling)}%`
    }

    const { width: parsedWidth, unit } = helpers.widthParser(width)

    switch (unit) {
      case '%':
        return width
      case 'px':
      default:
        return `${parsedWidth / parentWidth}%`
    }
  }

  render () {
    const { mjAttribute, children, sibling } = this.props
    const width = mjAttribute('width') || (100 / sibling)
    const mjColumnClass = this.getColumnClass()
    const divClasses = cx(mjColumnClass, 'outlook-group-fix')

    return (
      <div
        aria-labelledby={mjColumnClass}
        className={divClasses}
        data-column-width={parseInt(width)}
        data-vertical-align={this.styles.div.verticalAlign}
        style={this.styles.div}>
        <table
          role="presentation"
          cellPadding="0"
          cellSpacing="0"
          data-legacy-background={mjAttribute('background')}
          data-legacy-border="0"
          style={this.styles.table}
          width="100%">
          <tbody>
            {React.Children.map(children, child => React.cloneElement(child, { columnElement: true }))}
          </tbody>
        </table>
      </div>
    )
  }

}

Column.defaultMJMLDefinition = defaultMJMLDefinition
Column.tagName = tagName
Column.parentTag = parentTag
Column.baseStyles = baseStyles
Column.postRender = postRender

export default Column
