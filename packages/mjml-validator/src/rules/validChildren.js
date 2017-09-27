import filter from 'lodash/filter'
import includes from 'lodash/includes'

import dependencies from '../dependencies'
import ruleError from './ruleError'

export default function validChildren(element, { components }) {
  const {
    children,
    tagName,
  } = element

  const Component = components[tagName]

  if (!Component) {
    return null
  }

  if (!children || children.length == 0) {
    return null
  }

  return filter(children.map((child) => {
    const childTagName = child.tagName
    const ChildComponent = components[childTagName]
    const parentDependencies = dependencies[tagName] || []

    if (!ChildComponent) {
      return null
    }

    if (includes(parentDependencies, childTagName)) {
      return null
    }

    return ruleError(`${childTagName} cannot be used inside ${tagName}, only inside: ${parentDependencies.join(', ')}`, child)
  }))
}
