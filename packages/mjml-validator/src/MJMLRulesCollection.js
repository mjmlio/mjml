import warning from 'warning'
import { mapKeys } from 'lodash'
import { components } from 'mjml-core'

import * as rules from './rules'

const MJMLRulesCollection = {}
mapKeys(rules, (func, name) => registerRule(func, name, {components}))

export function registerRule(rule, name) {
  if (typeof rule !== 'function' || rule.length !== 2) {
    return warning(
      false,
      'Your rule must be a function and must have two parameters which are the element to validate and the components object imported from mjml-core',
    )
  }

  if (name) {
    MJMLRulesCollection[name] = rule
  } else {
    MJMLRulesCollection[rule.name] = rule
  }

  return true
}

export default MJMLRulesCollection
