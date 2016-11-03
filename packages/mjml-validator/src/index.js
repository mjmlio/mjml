import { documentParser } from 'mjml-core'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import values from 'lodash/values'
import ruleError from './rules/ruleError'
import * as defaultRules from './rules'
import customRules from './rules/custom'

const rules = customRules.hasCustomRules() ? customRules.getCustomRules(defaultRules) : defaultRules

// Construct defaultRulesToAdd == (true || undefined) => all default rules added
// Construct defaultRulesToAdd = [] => no default rules added
// Construct defaultRulesToAdd = ['validTag'] => only validTag rule applied
export class MJMLExtendedValidator {
  constructor (defaultRulesToAdd = true) {
    this.rules  = [];

    if (defaultRulesToAdd === true) {
      Object.keys(rules).map((ruleName) => {
        const rule = rules[ruleName]
        this.registerMJRule(rule)
        return ruleName
      })
    } else if (typeof defaultRulesToAdd == 'object') {

      Object.keys(rules).map((ruleName) => {
        if (defaultRulesToAdd.indexOf(ruleName) > -1) {
          const rule = rules[ruleName]
          this.registerMJRule(rule)
        }
        return ruleName
      })
    }
  }
  showError (message, element) {
    return ruleError(message, element)
  }
  registerMJRule (fn) {
    if (fn.length !== 1) {
      throw ('Your function must have one parameter which is the element to validate')
    }
    this.rules.push(fn);
  }
  parseValidate (content) {
    const element = documentParser(content)
    return this.validate(element)
  }
  validate (element) {
    const { children } = element
    let errors = concat(errors, ...values(this.rules).map(rule => {
      return rule(element)
    }))

    if (children && children.length > 0) {
      errors = concat(errors, ...children.map(this.validate.bind(this)))
    }

    return filter(errors)
  }
}

const validator = new MJMLExtendedValidator();

const validateNode = element => {
  return validator.validate(element)
}

export default validateNode
