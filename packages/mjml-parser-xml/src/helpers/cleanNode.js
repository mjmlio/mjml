import forEach from 'lodash/forEach'

export default function cleanNode(node) {
  delete node.parent

  // Delete children if needed
  if (node.children && node.children.length) {
    forEach(node.children, cleanNode)
  } else {
    delete node.children
  }

  // Delete attributes if needed
  if (node.attributes && Object.keys(node.attributes).length === 0) {
    delete node.attributes
  }
}
