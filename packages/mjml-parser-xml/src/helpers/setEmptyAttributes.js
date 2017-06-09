import forEach from 'lodash/forEach'

export default function setEmptyAttributes(node) {
  if (!node.attributes) {
    node.attributes = {}
  }
  if (node.children) {
    forEach(node.children, setEmptyAttributes)
  }
}
