import Immutable from 'immutable'
import MJMLElementsCollection from '../../MJMLElementsCollection'
import React, { Component } from 'react'
import _ from 'lodash'
import { widthParser } from "../../helpers/mjAttribute"
import { UnknownMJMLElement } from '../../Error'

const getElementWidth = ({element, siblings, parentWidth}) => {
  const { elem } = element.props
  let { width } = element.props

  if (!width && elem && elem.attributes && elem.attributes.width) {
    width = elem.attributes.width
  }

  if (width == undefined) {
    return parentWidth / siblings
  }

  const { width: parsedWidth, unit } = widthParser(width)

  switch(unit) {
    case '%':
      return parsedWidth * parentWidth / 100

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
          attributes: {},
          inheritedAttributes: []
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

    inheritedAttributes() {
      return _.reduce(this.state.getIn(['elem', 'inheritedAttributes']).toJS(), (result, value) => {
        result[value] = this.mjAttribute(value)
        return result
      }, {})
    }

    isInheritedAttributes(name) {
      return _.indexOf(this.state.getIn(['elem', 'inheritedAttributes']).toJS(), name) != -1
    }

    siblingsCount() {
      const children = this.state.getIn(['elem', 'children'])

      return this.hasReactChildren() ?  React.Children.count(children) : this.state.getIn(['elem', 'children']).size
    }

    getWidth() {
      return this.mjAttribute('rawPxWidth') || this.mjAttribute('width')
    }

    childDefaultProps(id) {
      return {
        id,
        key: id,
        color: this.mjAttribute('color'),
        parentWidth: this.getWidth(),
        verticalAlign: this.mjAttribute('vertical-align'),
        sibling: this.siblingsCount()
      }
    }

    renderWrappedOutlookChildren() {
      let elements          = this.renderChildren()

      if (elements && elements.get) {
        // had to break immutable here :(
        elements = elements.toArray()
      }

      const wrappedElements = []
      const prefix          = `mj-${this.mjElementName()}-outlook`
      const parentWidth     = this.getWidth()
      const siblings        = elements.length
      const elementsWidth   = elements.map((element) => {
        if (this.isInheritedAttributes('width')) {
          return parentWidth
        }

        return getElementWidth({element, siblings, parentWidth})
      })

      if (siblings == 0) {
        return []
      }

      elements.forEach((element, n) => {
        const width = elementsWidth[n]

        wrappedElements.push(React.cloneElement(element, _.merge({rawPxWidth: width}, this.inheritedAttributes())))

        if ( n < elements.length - 1 ) {
          wrappedElements.push(<div key={`outlook-${n}`}className={`${prefix}-line`} data-width={elementsWidth[n+1]}/>)
        }
      })

      const outlookOpenTag  = <div key="outlook-open" className={`${prefix}-open`} data-width={elementsWidth[0]} />
      const outlookCloseTag = <div key="outlook-close" className={`${prefix}-close`} />

      return [outlookOpenTag].concat(wrappedElements, [outlookCloseTag])
    }

    upgradeReactChildren(children) {
      return children.map((child, i) => {
        return React.cloneElement(child, this.childDefaultProps(i))
      })
    }

    hasReactChildren() {
      const children = this.state.getIn(['elem', 'children'])

      return !children || children.count() === 0 && React.Children.count(this.props.children) >= 1
    }

    renderChildren() {
      if (this.hasReactChildren()) {
        return this.upgradeReactChildren(React.Children.toArray(this.props.children));
      }

      const children = this.state.getIn(['elem', 'children'])
      let i = 0

      return children.map((elem) => {
        if (elem.get('tagName') && elem.get('tagName').indexOf('mj-') != -1) {
          i++

          const Element = MJMLElementsCollection[elem.get('tagName').substr(3)]

          if (!Element) {
            throw new UnknownMJMLElement(`Could not find element for : ${elem.get('tagName')}`)
          }

          const props = _.merge(this.childDefaultProps(i), {
            elem: elem.toJS()
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
