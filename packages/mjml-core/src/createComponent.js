// eslint-disable-next-line max-classes-per-file
import {
  get,
  forEach,
  identity,
  reduce,
  kebabCase,
  find,
  filter,
  isNil,
} from 'lodash'

import MJMLParser from 'mjml-parser-xml'

import shorthandParser, { borderParser } from './helpers/shorthandParser'
import formatAttributes from './helpers/formatAttributes'
import jsonToXML from './helpers/jsonToXML'

export function initComponent({ initialDatas, name }) {
  const Component = initialDatas.context.components[name]

  if (Component) {
    const component = new Component(initialDatas)

    if (component.headStyle) {
      component.context.addHeadStyle(name, component.headStyle)
    }
    if (component.componentHeadStyle) {
      component.context.addComponentHeadSyle(component.componentHeadStyle)
    }

    return component
  }

  return null
}

class Component {
  static getTagName() {
    return this.componentName || kebabCase(this.name)
  }

  static isRawElement() {
    return !!this.rawElement
  }

  static defaultAttributes = {}

  constructor(initialDatas = {}) {
    const {
      attributes = {},
      children = [],
      content = '',
      context = {},
      props = {},
      globalAttributes = {},
    } = initialDatas

    this.props = {
      ...props,
      children,
      content,
    }

    this.attributes = formatAttributes(
      {
        ...this.constructor.defaultAttributes,
        ...globalAttributes,
        ...attributes,
      },
      this.constructor.allowedAttributes,
    )
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
      // supports returning siblings elements from a custom component
      const partialMjml = MJMLParser(`<fragment>${mjml}</fragment>`, {
        ...options,
        components: this.context.components,
        ignoreIncludes: true,
      })
      return partialMjml.children
        .map((child) => this.context.processing(child, this.context))
        .join('')
    }

    return this.context.processing(mjml, this.context)
  }
}

export class BodyComponent extends Component {
  // eslint-disable-next-line class-methods-use-this
  getStyles() {
    return {}
  }

  getShorthandAttrValue(attribute, direction) {
    const mjAttributeDirection = this.getAttribute(`${attribute}-${direction}`)
    const mjAttribute = this.getAttribute(attribute)

    if (mjAttributeDirection) {
      return parseInt(mjAttributeDirection, 10)
    }

    if (!mjAttribute) {
      return 0
    }

    return shorthandParser(mjAttribute, direction)
  }

  getShorthandBorderValue(direction) {
    const borderDirection =
      direction && this.getAttribute(`border-${direction}`)
    const border = this.getAttribute('border')

    return borderParser(borderDirection || border || '0')
  }

  getBoxWidths() {
    const { containerWidth } = this.context
    const parsedWidth = parseInt(containerWidth, 10)

    const paddings =
      this.getShorthandAttrValue('padding', 'right') +
      this.getShorthandAttrValue('padding', 'left')

    const borders =
      this.getShorthandBorderValue('right') +
      this.getShorthandBorderValue('left')

    return {
      totalWidth: parsedWidth,
      borders,
      paddings,
      box: parsedWidth - paddings - borders,
    }
  }

  htmlAttributes(attributes) {
    const specialAttributes = {
      style: (v) => this.styles(v),
      default: identity,
    }

    return reduce(
      attributes,
      (output, v, name) => {
        const value = (specialAttributes[name] || specialAttributes.default)(v)

        if (!isNil(value)) {
          return `${output} ${name}="${value}"`
        }

        return output
      },
      '',
    )
  }

  styles(styles) {
    let stylesObject

    if (styles) {
      if (typeof styles === 'string') {
        stylesObject = get(this.getStyles(), styles)
      } else {
        stylesObject = styles
      }
    }

    return reduce(
      stylesObject,
      (output, value, name) => {
        if (!isNil(value)) {
          return `${output}${name}:${value};`
        }
        return output
      },
      '',
    )
  }

  renderChildren(children, options = {}) {
    const {
      props = {},
      renderer = (component) => component.render(),
      attributes = {},
      rawXML = false,
    } = options

    children = children || this.props.children

    if (rawXML) {
      return children.map((child) => jsonToXML(child)).join('\n')
    }

    const sibling = children.length

    const rawComponents = filter(this.context.components, (c) =>
      c.isRawElement(),
    )
    const nonRawSiblings = children.filter(
      (child) => !find(rawComponents, (c) => c.getTagName() === child.tagName),
    ).length

    let output = ''
    let index = 0

    forEach(children, (children) => {
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
            nonRawSiblings,
          },
        },
      })

      if (component !== null) {
        output += renderer(component)
      }

      index++ // eslint-disable-line no-plusplus
    })

    return output
  }
}

export class HeadComponent extends Component {
  static getTagName() {
    return this.componentName || kebabCase(this.name)
  }

  handlerChildren() {
    const { children } = this.props

    return children.map((children) => {
      const component = initComponent({
        name: children.tagName,
        initialDatas: {
          ...children,
          context: this.getChildContext(),
        },
      })

      if (!component) {
        // eslint-disable-next-line no-console
        console.error(`No matching component for tag : ${children.tagName}`)
        return null
      }

      if (component.handler) {
        component.handler()
      }

      if (component.render) {
        return component.render()
      }
      return null
    })
  }
}
