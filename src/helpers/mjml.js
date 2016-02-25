import _ from 'lodash'
import { fromJS } from 'immutable'
import MJMLElementsCollection from '../MJMLElementsCollection'

export const parseInstance = instance => {
  const parseNode = node => ({

    // copy all existing props, applying defaults
    ..._.defaultsDeep(node, MJMLElementsCollection[node.tagName.substr(3)].defaultMJMLDefinition),

    // do same to children
    children: (node.children || []).map(parseNode)

  })

  return fromJS(parseNode(instance))
}
