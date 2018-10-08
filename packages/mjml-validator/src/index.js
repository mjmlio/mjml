import { flatten, concat, filter, includes, values } from 'lodash'

import ruleError from './rules/ruleError'
import rulesCollection, { registerRule } from './MJMLRulesCollection'

const SKIP_ELEMENTS = ['mjml', 'mj-body', 'mj-head', 'mj-raw']

export const formatValidationError = ruleError

export { rulesCollection, registerRule }
export dependencies, { registerDependencies } from './dependencies'

export default function MJMLValidator(element, options = {}) {
  const { children, tagName } = element
  let errors

  if (!includes(SKIP_ELEMENTS, tagName)) {
    errors = flatten(
      concat(
        errors,
        ...values(rulesCollection)
          .map(rule => rule(element, {
            ...options,
            skipElements: SKIP_ELEMENTS,
          })),
      ),
    )
  }

  if (children && children.length > 0) {
    errors = flatten(
      concat(errors, ...children.map(child => MJMLValidator(child, options))),
    )
  }

  return filter(errors)
}
