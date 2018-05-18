import { compact, map } from 'lodash'

import { initializeType } from '../types/type'
import ruleError from './ruleError'

export default function validateAttribute(element, { components }) {
  const { attributes, tagName } = element

  const Component = components[tagName]

  if (!Component) {
    return null
  }

  return compact(
    map(attributes, (value, attr) => {
      const attrType =
        Component.allowedAttributes && Component.allowedAttributes[attr]
      if (!attrType) return null // attribute not allowed

      const TypeChecker = initializeType(attrType)
      const result = new TypeChecker(value)
      if (result.isValid()) return null
      return ruleError(result.getErrorMessage(), element)
    }),
  )
}
