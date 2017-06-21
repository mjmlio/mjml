import _ from 'lodash'

export default function setEmptyAttributes(node) {
  if (!node.attributes) {
    node.attributes = {}
  }
  if (node.children) {
    _.forEach(node.children, setEmptyAttributes)
  }
}
