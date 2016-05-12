import { fromJS } from 'immutable'
import defaultsDeep from 'lodash/defaultsDeep'
import MJMLElementsCollection, { mjCssClasses, mjDefaultAttributes } from '../MJMLElementsCollection'

export const parseInstance = instance => {
  const parseNode = (node) => {
    const Component   = MJMLElementsCollection[node.tagName]
    const nodeClasses = node['mj-class']

    const classAttributes = !nodeClasses ? {} : defaultsDeep({}, ...nodeClasses.split(' ').map(nodeClass => mjCssClasses[nodeClass]))

    console.log(node.tagName, mjDefaultAttributes, mjCssClasses)

    return !Component ? {} : {
      // copy all existing props, applying defaults
      ...defaultsDeep(node, mjDefaultAttributes[node.tagName], classAttributes, Component.defaultMJMLDefinition),
      // do same to children
      children: (node.children || []).map(parseNode)
    }
  }

  return fromJS(parseNode(instance))
}
