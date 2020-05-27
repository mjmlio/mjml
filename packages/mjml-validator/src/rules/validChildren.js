import { filter, includes, keys } from 'lodash'

import dependencies from '../dependencies'
import ruleError from './ruleError'

export default function validChildren(element, { components, skipElements }) {
  const { children, tagName } = element

  const Component = components[tagName]

  if (!Component || !children || !children.length) {
    return null
  }

  return filter(
    children.map(child => {
      const childTagName = child.tagName
      const ChildComponent = components[childTagName]
      const parentDependencies = dependencies[tagName] || []

      if (
        !ChildComponent ||
        includes(skipElements, childTagName) ||
        includes(parentDependencies, childTagName) ||
        parentDependencies.some(
          dep => dep instanceof RegExp && dep.test(childTagName),
        )
      ) {
        return null
      }

      const allowedDependencies = keys(dependencies).filter(
        key =>
          includes(dependencies[key], childTagName) ||
          dependencies[key].some(
            dep => dep instanceof RegExp && dep.test(childTagName),
          ),
      )

      return ruleError(
        `${childTagName} cannot be used inside ${tagName}, only inside: ${allowedDependencies.join(
          ', ',
        )}`,
        child,
      )
    }),
  )
}
