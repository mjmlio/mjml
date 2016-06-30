import { fromJS } from 'immutable'
import defaultsDeep from 'lodash/defaultsDeep'
import merge from 'lodash/merge'
import MJMLElementsCollection  from '../MJMLElementsCollection'

export const parseInstance = (instance, attributes) => {
  const parseNode = (node) => {
    node['attributes'] = node['attributes'] || {}

    const Component   = MJMLElementsCollection[node.tagName]
    const nodeClasses = node['attributes']['mj-class']

    const classAttributes = !nodeClasses ? {} : merge({}, ...nodeClasses.split(' ').map(nodeClass => {
      return { attributes: attributes.cssClasses[nodeClass] }
    }))

    return !Component ? {} : {
      // copy all existing props, applying defaults
      ...defaultsDeep(node, classAttributes, { attributes: attributes.defaultAttributes[node.tagName] }, { attributes: attributes.defaultAttributes["mj-all"] } || {}, Component.defaultMJMLDefinition),
      // do same to children
      children: (node.children || []).map(parseNode)
    }
  }

  return fromJS(parseNode(instance))
}
