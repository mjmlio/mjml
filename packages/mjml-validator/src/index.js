import concat from 'lodash/concat'
import filter from 'lodash/filter'
import values from 'lodash/values'
import ruleError from './rules/ruleError'
import rulesCollection, { registerMJRule } from './MJMLRulesCollection'

export { rulesCollection, registerMJRule }

export const formatValidationError = ruleError

const validateNode = (element) => {
  const { children } = element

  let errors = concat(errors, ...values(rulesCollection).map(rule => {
    return rule(element)
  }))

  if (children && children.length > 0) {
    errors = concat(errors, ...children.map((child) => validateNode(child)))
  }

  return filter(errors)
}

export default validateNode
