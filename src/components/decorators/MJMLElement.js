import Immutable from 'immutable'
import MJMLElementsCollection from '../../MJMLElementsCollection'
import React, { Component } from 'react'
import _ from 'lodash'
import { widthParser } from "../../helpers/mjAttribute"
import { UnknownMJMLElement } from '../../Error'

const getElementWidth = (element, siblings) => {
  const { elem } = element.props
  let { width } = element.props

  if (!width && elem && elem.attributes && elem.attributes.width) {
    width = elem.attributes.width
  }

  if (width == undefined) {
    return 600 / siblings
  }

  const { width: parsedWidth, unit } = widthParser(width)

  switch(unit) {
  case '%':
    return parsedWidth * 6 // * 600 / 100

  case 'px':
  default:
    return parsedWidth
  }
}

function createComponent(ComposedComponent, defaultAttributes) {

  class MJMLElement extends Component {

    constructor(props) {
      super(props)

      this.state = Immutable.fromJS({
        elem: _.merge({
          children: [],
          attributes: {}
        }, defaultAttributes)
      })

      this.state = this.state.mergeDeep(props)
    }

    mjAttribute(name) {
      if (this.props[name] != undefined) {
        return this.props[name]
      }

      return this.state.getIn(['elem', 'attributes']).get(name)
    }

    mjContent() {
      return _.trim(this.state.getIn(['elem', 'content'])) || React.renderToStaticMarkup(this.props.children)
    }

    mjElementName() {
      return this.state.getIn(['elem', 'tagName']).substr(3)
    }

    childDefaultProps(id) {
      return {
        id,
        key: id,
        color: this.mjAttribute('color'),
        parentWidth: this.mjAttribute('width'),
        verticalAlign: this.mjAttribute('vertical-align')
      }
    }

    renderWrappedOutlookChildren() {
      let elements          = this.renderChildren()
      const wrappedElements = []
      const prefix          = `mj-${this.mjElementName()}-outlook`

      if (elements && elements.get) {
        // had to break immutable here :(
        elements = elements.toArray()
      }

      if (elements.length == 0) {
        return []
      }

      elements.forEach((element, n) => {
        wrappedElements.push(element)
        if ( n < elements.length - 1 ) {
          const width = getElementWidth(elements[n+1], elements.length)

          wrappedElements.push(<div key={`outlook-${n}`}className={`${prefix}-line`} data-width={width}/>)
        }
      })

      const outlookOpenTag  = <div key="outlook-open" className={`${prefix}-open`} data-width={getElementWidth(elements[0], elements.length)} />
      const outlookCloseTag = <div key="outlook-close" className={`${prefix}-close`} />

      return [outlookOpenTag].concat(wrappedElements, [outlookCloseTag])
    }

    upgradeReactChildren(children) {
      const sibling = React.Children.count(children)

      return children.map((child, i) => {
        return React.cloneElement(child, _.merge(this.childDefaultProps(i), { sibling }))
      })
    }

    renderChildren() {
      const children = this.state.getIn(['elem', 'children'])

      if (!children || children.count() === 0 && React.Children.count(this.props.children) >= 1) {
        return this.upgradeReactChildren(React.Children.toArray(this.props.children));
      }

      let i = 0

      return children.map((elem) => {
        if (elem.get('tagName') && elem.get('tagName').indexOf('mj-') != -1) {
          i++

          const Element = MJMLElementsCollection[elem.get('tagName').substr(3)]

          if (!Element) {
            throw new UnknownMJMLElement(`Could not find element for : ${elem.get('tagName')}`)
          }

          const props = _.merge(this.childDefaultProps(i), {
            elem: elem.toJS(),
            sibling: children.size
          })

          return React.createElement(Element, props)
        }
      })
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          mjAttribute={::this.mjAttribute}
          mjContent={::this.mjContent}
          mjElementName={::this.mjElementName}
          renderChildren={::this.renderChildren}
          renderWrappedOutlookChildren={::this.renderWrappedOutlookChildren} />
      )
    }

  }

  return MJMLElement

}

export default (defaultAttributes) => {
  if (typeof defaultAttributes == 'function') {
    return createComponent(defaultAttributes)
  }

  return ComposedComponent => createComponent(ComposedComponent, defaultAttributes)
}
