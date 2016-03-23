import _ from 'lodash'
import { fromJS } from 'immutable'
import MJMLElementsCollection from '../MJMLElementsCollection'

export const parseInstance = instance => {
  const parseNode = (node) => {
    const Component = MJMLElementsCollection[node.tagName]

    return !Component ? {} : {
      // copy all existing props, applying defaults
      ..._.defaultsDeep(node, Component.defaultMJMLDefinition),
      // do same to children
      children: (node.children || []).map(parseNode)
    }
  }

  return fromJS(parseNode(instance))
}
