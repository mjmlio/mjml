import concat from 'lodash/concat'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import ruleError from './rules/ruleError'
import rulesCollection, { registerRule } from './MJMLRulesCollection'
import values from 'lodash/values'

export { rulesCollection, registerRule }

export const formatValidationError = ruleError

const SKIP_ELEMENTS = [ "mjml", "mj-body", "mj-head" ]

const validateNode = (element) => {
  const { children, tagName } = element
  let errors

  if ( !includes(SKIP_ELEMENTS, tagName) ) {
    errors = concat(errors, ...values(rulesCollection).map(rule => {
      return rule(element)
    }))
  }

  if (children && children.length > 0) {
    errors = concat(errors, ...children.map((child) => validateNode(child)))
  }

  return filter(errors)
}

export dependencies, { registerDependencies } from './dependencies'
export default validateNode
