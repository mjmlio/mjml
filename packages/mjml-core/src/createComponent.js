import forEach from 'lodash/forEach'
import reduce from 'lodash/reduce'
import objectPath from 'object-path'
import shorthandParser from './helpers/shorthandParser'
import parseXML from 'mjml-parser-xml'

import {
  initComponent,
} from './components'


export function createBodyComponent (name, component) {
  return createComponent('body', name, component)
}

export function createHeadComponent (name, component) {
  return createComponent('head', name, component)
}

export default function createComponent (type, name, component) {

  const onlyFor = forType => {
    return function (target, key, desc) {
      const fn = desc.value

      desc.value = function (...args) {
        if (forType !== type) {
          throw new Error(`This method can be use only with a ${type} component.`)
        }

        return fn.apply(this, args)
      }
    }
  }


  class Component {

    static getName () {
      return name
    }

    static getType () {
      return type
    }

    constructor (initialDatas = {}) {
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
        ...component.defaultAttributes,
        ...attributes,
      }
      this.context = context

      return this
    }

    getChildContext () {
      return this.context
    }

    @onlyFor('body')
    getStyles () {
      return {}
    }

    getMjAttribute (name) {
      return this.attributes[name] || undefined
    }

    getMjContent () {
      return this.props.content.trim()
    }

    @onlyFor('body')
    getShorthandAttrValue (attribute, direction) {
      const mjAttributeDirection = this.getMjAttribute(`${attribute}-${direction}`)
      const mjAttribute = this.getMjAttribute(attribute)

      if (mjAttributeDirection) {
        return parseInt(mjAttributeDirection)
      }

      if (!mjAttribute) {
        return 0
      }

      return shorthandParser(mjAttribute, direction)
    }

    @onlyFor('body')
    generateHtmlAttributes (attributes) {
      const specialAttributes = {
        style: (v) => this.generateStyles(v),
        default: (v) => v
      }

      return reduce(attributes, (output, v, name) => {
        const value = (specialAttributes[name] || specialAttributes['default'])(v)

        if (value) {
          return output += ` ${name}="${value}"`
        }

        return output
      }, '')
    }

    @onlyFor('body')
    generateStyles (styles) {
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

    @onlyFor('head')
    handlerChildren () {
      const childrens = this.props.children

      forEach(childrens, (children) => {
        const component = initComponent({
          name: children.tagName,
          initialDatas: {
            ...children,
            context: this.getChildContext(),
          }
        })

        if (component.handler) {
          component.handler()
        }
      })
    }

    @onlyFor('body')
    renderChildren (children, options = {}) {
      const {
        props = {},
        renderer = component => component.render(),
        attributes = {},
      } = options

      children = children || this.props.children

      const sibling = children.length

      let output = ''

      for (let index = 0; index < sibling; index++) {
        const child = children[index]
        const component = initComponent({
          name: child.tagName,
          initialDatas: {
            ...child,
            attributes: {
              ...attributes,
              ...child.attributes,
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
      }

      return output
    }

  }

  const newComponent = Component

  if (component.useMJML) {
    component._render = component.render
    component.render = function() {
      const mjml = parseXML(this._render(), {ignoreInclude: true})

      return this.context.processing(mjml, this.context)
    }
  }

  Object.assign(newComponent.prototype, component)

  return newComponent

}
