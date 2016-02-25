import _ from 'lodash'
import { UnknownMJMLElement } from '../../Error'
import { widthParser, paddingParser } from '../../helpers/mjAttribute'
import MJMLElementsCollection from '../../MJMLElementsCollection'
import React, { Component } from 'react'

const getElementWidth = ({ element, siblings, parentWidth }) => {
  const { elem } = element.props
  let { width } = element.props

  if (!width && elem && elem.attributes && elem.attributes.width) {
    width = elem.attributes.width
  }

  if (width == undefined) {
    return parentWidth / siblings
  }

  const { width: parsedWidth, unit } = widthParser(width)

  switch (unit) {
    case '%':
      return parsedWidth * parentWidth / 100

    case 'px':
    default:
      return parsedWidth
  }
}

// used to pass column count to children
let columnCount = 1

function createComponent(ComposedComponent, defaultMJMLDefinition) {

  class MJMLElement extends Component {

    static defaultMJMLDefinition = defaultMJMLDefinition;

    mjAttribute = name => this.props.mjml.getIn(['attributes', name])

    mjContent = () => _.trim(this.props.mjml.get('content')) || (this.props.children && React.renderToStaticMarkup(this.props.children))

    mjName = () => this.props.mjml.get('tagName').substr(3)

    inheritedAttributes () {
      return this.props.mjml.get('inheritedAttributes').reduce((result, value) => {
        result[value] = this.mjAttribute(value)

        return result
      }, {})
    }

    isInheritedAttributes = name => this.props.mjml.get('inheritedAttributes') && this.props.mjml.get('inheritedAttributes').includes(name)

    getWidth = () => this.mjAttribute('rawPxWidth') || this.mjAttribute('width')

    getPadding = () => paddingParser.bind(this)

    renderWrappedOutlookChildren = children => {
      children = React.Children.toArray(children)

      const prefix        = `mj-${this.mjName()}-outlook`
      const parentWidth   = this.getWidth()
      const siblings      = children.length
      const elementsWidth = children.map(element => {
        if (this.isInheritedAttributes('width')) {
          return parentWidth
        }

        return getElementWidth({ element, siblings, parentWidth })
      })

      if (siblings == 0) {
        return []
      }

      const wrappedElements = children.reduce((result, element, n) => {
        let mjml = element.props.mjml.setIn(['attributes', 'rawPxWidth'], elementsWidth[n])

        if (this.props.mjml.get('inheritedAttributes')) {
          mjml = mjml.mergeIn(['attributes', this.inheritedAttributes()])
        }

        result.push(React.cloneElement(element, { mjml: mjml }))

        if (n < children.length - 1) {
          result.push(<div key={`outlook-${n}`} className={`${prefix}-line`} data-width={elementsWidth[n + 1]} />)
        }

        return result
      }, [<div key="outlook-open" className={`${prefix}-open`} data-width={elementsWidth[0]} />])

      wrappedElements.push(<div key="outlook-close" className={`${prefix}-close`} />)

      return wrappedElements
    }

    generateChildren () {
      const { mjml } = this.props

      return mjml.get('children').map((childMjml, i) => {
        const tag = childMjml.get('tagName').substr(3)
        const Element = MJMLElementsCollection[tag]

        if (!Element) {
          throw new UnknownMJMLElement(`Could not find element for : ${tag}`)
        }

        return (
          <Element
            key={i}
            mjml={childMjml}
            parentMjml={mjml} />
        )
      })
    }

    buildProps () {
      const { mjml, parentMjml } = this.props

      const childMethods = [
        'mjAttribute',
        'mjContent',
        'renderWrappedOutlookChildren',
        'getPadding'
      ]

      // assign sibling column count for element and children
      if (this.mjName() === 'column') {
        columnCount = parentMjml.get('children').size
      }

      return {

        // pass all props from decorator
        ...this.props,

        // set mjName
        mjName: this.mjName(),

        // generate children
        children: this.generateChildren(),

        // column count, can change display
        sibling: columnCount,

        color: this.mjAttribute('color'),
        parentWidth: this.getWidth(),
        verticalAlign: this.mjAttribute('vertical-align'),

        // assign helpers methods
        ...childMethods.reduce((acc, method) => ({
          ...acc,
          [method]: this[method]
        }), {})

      }
    }

    render () {
      return (
        <ComposedComponent {...this.buildProps()} />
      )
    }

  }

  return MJMLElement

}

export default (defaultMJMLDefinition) => {
  if (typeof defaultMJMLDefinition == 'function') {
    return createComponent(defaultMJMLDefinition)
  }

  return ComposedComponent => createComponent(ComposedComponent, defaultMJMLDefinition)
}
