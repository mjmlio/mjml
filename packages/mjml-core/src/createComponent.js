import _ from 'lodash'
import objectPath from 'object-path'

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
    getPadding (direction) {
      const paddingDirection = this.getMjAttribute(`padding-${direction}`)
      const padding = this.getMjAttribute('padding')

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
          directions = { top: 0, bottom: 0, left: 1, right: 1 }
          break

        case 3:
          directions = { top: 0, left: 1, right: 1, bottom: 2 }
          break

        case 4:
          directions = { top: 0, right: 1, bottom: 2, left: 3 }
          break
      }

      return parseFloat(paddings[directions[direction]] || 0)
    }

    @onlyFor('body')
    generateHtmlAttributes (attributes) {
      let output = ''

      _.forEach(attributes, (value, name) => {
        if (value) {
          output += ` ${name}="${value}"`
        }
      })

      return output
    }

    @onlyFor('body')
    generateStyles (styles) {
      styles = styles
        ? typeof styles === 'string'
          ? objectPath.get(this.getStyles(), styles)
          : styles
        : this.getStyles()

      let output = ''

      _.forEach(styles, (value, name) => {
        if (value) {
          output += `${name}:${value};`
        }
      })

      return output
    }

    @onlyFor('body')
    renderChildren (children, options = {}) {
      const {
        props = {},
        renderer = component => component.render(),
      } = options

      children = children || this.props.children

      const sibling = children.length

      let output = ''

      for (let index = 0; index < sibling; index++) {
        const child = children[index]
        const component = initComponent({
          type,
          name: child.tagName,
          initialDatas: {
            ...child,
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

  Object.assign(newComponent.prototype, component)

  return newComponent

}
