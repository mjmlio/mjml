import _ from 'lodash'

export default function cleanNode (node) {
  delete node.parent

  // Delete children if needed
  if (node.children.length) {
    _.forEach(node.children, cleanNode)
  } else {
    delete node.children
  }

  // Delete attributes if needed
  if (Object.keys(node.attributes).length === 0) {
    delete node.attributes
  }
}
