import { fromJS } from 'immutable'
import defaultsDeep from 'lodash/defaultsDeep'
import MJMLElementsCollection  from '../MJMLElementsCollection'
import mjCssClasses from '../mjCssClasses'
import mjDefaultAttributes from '../mjDefaultAttributes'

export const parseInstance = instance => {
  const parseNode = (node) => {
    node['attributes'] = node['attributes'] || {}

    const Component   = MJMLElementsCollection[node.tagName]
    const nodeClasses = node['attributes']['mj-class']

    const classAttributes = !nodeClasses ? {} : defaultsDeep({}, ...nodeClasses.split(' ').map(nodeClass => {
      return { attributes: mjCssClasses[nodeClass] }
    }))

    return !Component ? {} : {
      // copy all existing props, applying defaults
      ...defaultsDeep(node, classAttributes, { attributes: mjDefaultAttributes[node.tagName] }, mjDefaultAttributes["mj-all"] || {}, Component.defaultMJMLDefinition),
      // do same to children
      children: (node.children || []).map(parseNode)
    }
  }

  return fromJS(parseNode(instance))
}
