import forEach from 'lodash/forEach'
import identity from 'lodash/identity'
import reduce from 'lodash/reduce'

import objectPath from 'object-path'

import MJMLParser from 'mjml-parser-xml'

import shorthandParser from './helpers/shorthandParser'

import components, { initComponent } from './components'

class Component {

  static defaultAttributes = {}

  constructor(initialDatas = {}) {
    const {
      attributes = {},
      children = [],
      content = '',
      context = {},
      props = {},
    } = initialDatas

    this.props = {
      ...props,
      children,
      content,
    }

    this.attributes = {
      ...this.constructor.defaultAttributes,
      ...attributes,
    }
    this.context = context

    return this
  }

  getChildContext() {
    return this.context
  }

  getAttribute(name) {
    return this.attributes[name]
  }

  getContent() {
    return this.props.content.trim()
  }

  renderMJML(mjml, options = {}) {
    if (typeof mjml === 'string') {
      mjml = MJMLParser(mjml, {
        ...options,
        components,
        ignoreInclude: true,
      })
    }

    return this.context.processing(mjml, this.context)
  }

}

export class BodyComponent extends Component {

  getStyles() {
    return {}
  }

  getShorthandAttrValue(attribute, direction) {
    const mjAttributeDirection = this.getAttribute(`${attribute}-${direction}`)
    const mjAttribute = this.getAttribute(attribute)

    if (mjAttributeDirection) {
      return parseInt(mjAttributeDirection)
    }

    if (!mjAttribute) {
      return 0
    }

    return shorthandParser(mjAttribute, direction)
  }

  htmlAttributes(attributes) {
    const specialAttributes = {
      style: v => this.styles(v),
      default: identity,
    }

    return reduce(attributes, (output, v, name) => {
      const value = (specialAttributes[name] || specialAttributes.default)(v)

      if (value) {
        return output += ` ${name}="${value}"`
      }

      return output
    }, '')
  }

  styles(styles) {
    styles = styles
      ? typeof styles === 'string'
        ? objectPath.get(this.getStyles(), styles)
        : styles
      : this.getStyles()

    let output = ''

    forEach(styles, (value, name) => {
      if (value) {
        output += `${name}:${value};`
      }
    })

    return output
  }

  renderChildren(childrens, options = {}) {
    const {
      props = {},
      renderer = component => component.render(),
      attributes = {},
    } = options

    childrens = childrens || this.props.children

    const sibling = childrens.length

    let output = ''
    let index = 0

    forEach(childrens, (children) => {
      const component = initComponent({
        name: children.tagName,
        initialDatas: {
          ...children,
          attributes: {
            ...attributes,
            ...children.attributes,
          },
          context: this.getChildContext(),
          props: {
            ...props,
            first: index === 0,
            index,
            last: index + 1 === sibling,
            sibling,
          },
        },
      })

      if (component !== null) {
        output += renderer(component)
      }

      index++
    })

    return output
  }

}

export class HeadComponent extends Component {

  handlerChildren() {
    const childrens = this.props.children

    forEach(childrens, (children) => {
      const component = initComponent({
        name: children.tagName,
        initialDatas: {
          ...children,
          context: this.getChildContext(),
        },
      })

      if (component.handler) {
        component.handler()
      }
    })
  }

}
