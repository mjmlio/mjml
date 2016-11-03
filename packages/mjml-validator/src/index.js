import concat from 'lodash/concat'
import filter from 'lodash/filter'
import values from 'lodash/values'
import * as defaultRules from './rules'
import customRules from './rules/custom';

const rules = customRules.hasCustomRules() ? customRules.getCustomRules(defaultRules) : defaultRules

const validateNode = element => {
  const { children } = element
  let errors = concat([], ...values(rules).map(rule => rule(element)))

  if (children && children.length > 0) {
    errors = concat(errors, ...children.map(validateNode))
  }

  return filter(errors)
}

export default validateNode
