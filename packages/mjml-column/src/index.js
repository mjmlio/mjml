import { MJMLElement, helpers } from 'mjml-core'
import each from 'lodash/each'
import merge from 'lodash/merge'
import React, { Component } from 'react'
import uniq from 'lodash/uniq'
import include from 'lodash/include'

const tagName = 'mj-column'
const parentTag = ['mj-section']
const defaultMJMLDefinition = {
  attributes: {
    'width': null,
    'background': null,
    'background-color': null,
    'vertical-align': null
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
const schemaXsd = elements => {
  const columnElements = Object.keys(elements).map(element => include(elements[element].parentTag, tagName) ? elements[element].tagName : null).filter(Boolean)

  return `
    <xs:complexType name="${tagName}-elements" mixed="true">
      <xs:sequence>
        ${columnElements.map(elem => `<xs:element name="${elem}" minOccurs="0" maxOccurs="unbounded"/>`)}
      </xs:sequence>
    </xs:complexType>

    <xs:complexType name="${tagName}-attributes">
      <xs:complexContent>
        <xs:extension base="xs:string">
          ${Object.keys(defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
        </xs:extension>
      </xs:simpleContent>
    </xs:complexType>

    <xs:element name="${tagName}" type="${tagName}-attributes" />`
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
