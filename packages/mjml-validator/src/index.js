import concat from 'lodash/concat'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import values from 'lodash/values'

import ruleError from './rules/ruleError'
import rulesCollection, { registerRule } from './MJMLRulesCollection'

const SKIP_ELEMENTS = [
  'mjml',
  'mj-body',
  'mj-head',
]

export const formatValidationError = ruleError

export { rulesCollection, registerRule }
export dependencies, { registerDependencies } from './dependencies'

export default function MJMLValidator(element, options = {}) {
  const {
    children,
    tagName,
  } = element

  let errors

  if (!includes(SKIP_ELEMENTS, tagName)) {
    errors = concat(errors, ...values(rulesCollection).map(rule => rule(element, options)))
  }

  if (children && children.length > 0) {
    errors = concat(errors, ...children.map(child => MJMLValidator(child, options)))
  }

  return filter(errors)
}
