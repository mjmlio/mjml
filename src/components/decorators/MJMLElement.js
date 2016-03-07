import _ from 'lodash'
import { UnknownMJMLElement } from '../../Error'
import { widthParser } from '../../helpers/mjAttribute'
import MJMLElementsCollection from '../../MJMLElementsCollection'
import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'

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
let siblingCount = 1

function createComponent(ComposedComponent, defaultMJMLDefinition) {

  class MJMLElement extends Component {

    static defaultMJMLDefinition = defaultMJMLDefinition;

    mjAttribute = name => this.props.mjml.getIn(['attributes', name])

    mjName = () => this.props.mjml.get('tagName').substr(3)

    mjContent = () => {
      const content = this.props.mjml.get('content')

      if (content) {
        return _.trim(content)
      }

      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return child
        }
        return ReactDOMServer.renderToStaticMarkup(child)
      })
    }

    inheritedAttributes () {
      return this.props.mjml.get('inheritedAttributes').reduce((result, value) => {
        result[value] = this.mjAttribute(value)

        return result
      }, {})
    }

    isInheritedAttributes = name => this.props.mjml.get('inheritedAttributes') && this.props.mjml.get('inheritedAttributes').includes(name)

    getWidth = () => this.mjAttribute('rawPxWidth') || this.mjAttribute('width')

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

    paddingParser = direction => {
      const paddingDirection = this.mjAttribute(`padding-${direction}`)
      const padding = this.mjAttribute('padding')

      if (paddingDirection) {
        return parseInt(paddingDirection)
      }

      if (!padding) {
        return 0
      }

      const paddings = padding.split(' ')
      let directions = {}

      switch (paddings.length) {
        case 1:
          return parseInt(padding)
        case 2:
          directions = {top: 0, bottom: 0, left: 1, right: 1}
          break;
        case 3:
          directions = {top: 0, left: 1, right: 1, bottom: 2}
          break;
        case 4:
          directions = {top: 0, right: 1, bottom: 2, left: 3}
          break;
      }

      return parseInt(paddings[directions[direction]] || 0 )
    }

    generateChildren () {
      const { mjml: parentMjml } = this.props

      return parentMjml.get('children').map((mjml, i) => {
        const childMjml = mjml.setIn(['attributes', 'parentWidth'], this.mjAttribute('rawPxWidth'))
        const tag = childMjml.get('tagName').substr(3)
        const Element = MJMLElementsCollection[tag]

        if (!Element) {
          throw new UnknownMJMLElement(`Could not find element for : ${tag}`)
        }

        return (
          <Element
            key={i}
            mjml={childMjml}
            parentMjml={parentMjml} />
        )
      })
    }

    buildProps () {
      const { parentMjml } = this.props

      const childMethods = [
        'mjAttribute',
        'mjContent',
        'renderWrappedOutlookChildren'
      ]

      // assign sibling count for element and children
      if (this.mjName() === 'column') {
        siblingCount = parentMjml.get('children').size
      }

      return {

        // pass all props from decorator
        ...this.props,

        // set mjName
        mjName: this.mjName(),

        // generate children
        children: this.generateChildren(),

        // siblings count, can change display
        sibling: siblingCount,

        parentWidth: this.getWidth(),
        getPadding: this.paddingParser,

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
