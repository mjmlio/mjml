import { MJMLElement, helpers } from 'mjml-core'
import each from 'lodash/each'
import merge from 'lodash/merge'
import React, { Component } from 'react'
import uniq from 'lodash/uniq'

const tagName = 'mj-column'
const parentTag = 'mj-section'
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
const schemaXsd = elements => {
  const columnElements = Object.keys(elements).map(element => elements[element].parentTag === tagName ? elements[element].tagName : null).filter(Boolean)

  return `<xs:complexType name="${tagName}">
    <xs:choice maxOccurs="unbounded" minOccurs="1">
      ${(columnElements.map(element => `<xs:element name="${element}" type="${element}" minOccurs="0" maxOccurs="unbounded" />`).join(`\n`))}
    </xs:choice>
  </xs:complexType>`
}

@MJMLElement
class Column extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, baseStyles, {
      div: {
        display: 'inline-block',
        fontSize: '13px',
        textAlign: 'left',
        width: this.getMobileWidth()
      },
      table: {
        background: mjAttribute('background-color'),
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
            {children.map(child => React.cloneElement(child, { columnElement: true }))}
          </tbody>
        </table>
      </div>
    )
  }

}

Column.tagName = tagName
Column.parentTag = parentTag
Column.baseStyles = baseStyles
Column.postRender = postRender
Column.schemaXsd = schemaXsd

export default Column
