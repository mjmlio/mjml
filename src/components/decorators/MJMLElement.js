import _ from 'lodash'
import { UnknownMJMLElement } from '../../Error'
import { widthParser } from '../../helpers/mjAttribute'
import hoistNonReactStatic from 'hoist-non-react-statics'
import Immutable from "immutable"
import MJMLElementsCollection from '../../MJMLElementsCollection'
import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'

const getElementWidth = ({ element, siblings, parentWidth }) => {
  const { mjml } = element.props
  let { width } = element.props

  if (!width && mjml) {
    width = mjml.getIn(['attributes', 'width'])
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

    constructor(props) {
      super(props)

      this.mjml = props.mjml || Immutable.fromJS(defaultMJMLDefinition).mergeIn(['attributes'], props)
    }

    mjAttribute = name => this.mjml.getIn(['attributes', name])

    mjName = () =>  {
      return this.mjml.get('tagName').substr(3)
    }

    mjContent = () => {
      const content = this.mjml.get('content')

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
      return this.mjml.get('inheritedAttributes').reduce((result, value) => {
        result[value] = this.mjAttribute(value)

        return result
      }, {})
    }

    isInheritedAttributes = name => this.mjml.get('inheritedAttributes') && this.mjml.get('inheritedAttributes').includes(name)

    getWidth = () => this.mjAttribute('rawPxWidth') || this.mjAttribute('width')

    renderWrappedOutlookChildren = children => {
      children = React.Children.toArray(children)
      const realChildren = children.filter(child => child.props.mjml.get('tagName') !== 'mj-raw')

      const prefix = `mj-${this.mjName()}-outlook`
      const parentWidth = this.getWidth()
      const siblings = realChildren.length
      const elementsWidth = realChildren.map(element => {
        if (this.isInheritedAttributes('width')) {
          return parseInt(parentWidth)
        }

        return getElementWidth({ element, siblings, parentWidth })
      })

      const wrappedElements = []

      if (siblings == 0) {
        return wrappedElements
      }

      wrappedElements.push(<div key="outlook-open" className={`${prefix}-open`} data-width={elementsWidth[0]} />)

      let i = 0

      children.forEach(child => {
        let mjml = child.props.mjml

        if (mjml.get('tagName') !== 'mj-raw') {
          mjml = child.props.mjml.setIn(['attributes', 'rawPxWidth'], elementsWidth[i])

          if (this.mjml.get('inheritedAttributes')) {
            mjml = mjml.mergeIn(['attributes', this.inheritedAttributes()])
          }

          wrappedElements.push(React.cloneElement(child, { mjml: mjml }))

          if (i < realChildren.length - 1) {
            wrappedElements.push(<div key={`outlook-${i}`} className={`${prefix}-line`} data-width={elementsWidth[i + 1]} />)
          }

          i++
        } else {
          wrappedElements.push(React.cloneElement(child, { mjml: mjml }))
        }
      })

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

      if (!parentMjml) {
        return []
      }

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
      if (parentMjml && this.mjName() === 'column') {
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

  hoistNonReactStatic(MJMLElement, ComposedComponent)

  return MJMLElement

}

export default (defaultMJMLDefinition) => {
  if (typeof defaultMJMLDefinition == 'function') {
    return createComponent(defaultMJMLDefinition)
  }

  return ComposedComponent => createComponent(ComposedComponent, defaultMJMLDefinition)
}
