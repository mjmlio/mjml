import concat from 'lodash/concat'
import filter from 'lodash/filter'
import values from 'lodash/values'
import * as rules from './rules'

const validateNode = element => {
  const { children } = element
  let errors = concat([], ...values(rules).map(rule => rule(element)))

  if (children && children.length > 0) {
    errors = concat(errors, ...children.map(validateNode))
  }

  return filter(errors)
}

export default validateNode
