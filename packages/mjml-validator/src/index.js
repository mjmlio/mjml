import { flatten, concat, filter, includes, values } from 'lodash'

import ruleError from './rules/ruleError'
import rulesCollection, { registerRule } from './MJMLRulesCollection'

const SKIP_ELEMENTS = ['mjml']

export const formatValidationError = ruleError

export { rulesCollection, registerRule }
export { default as dependencies, registerDependencies } from './dependencies'

export default function MJMLValidator(element, options = {}) {
  const { children, tagName } = element
  let errors

  const skipElements = options.skipElements || SKIP_ELEMENTS

  if (!includes(skipElements, tagName)) {
    errors = flatten(
      concat(
        errors,
        ...values(rulesCollection).map((rule) =>
          rule(element, {
            skipElements,
            ...options,
          }),
        ),
      ),
    )
  }

  if (children && children.length > 0) {
    errors = flatten(
      concat(errors, ...children.map((child) => MJMLValidator(child, options))),
    )
  }

  return filter(errors)
}
