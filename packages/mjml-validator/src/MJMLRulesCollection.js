import warning from 'warning'
import { mapKeys } from 'lodash'

import * as rules from './rules'

const MJMLRulesCollection = {}

export function registerRule(rule, name) {
  if (typeof rule !== 'function') {
    return warning(
      false,
      'Your rule must be a function',
    )
  }

  if (name) {
    MJMLRulesCollection[name] = rule
  } else {
    MJMLRulesCollection[rule.name] = rule
  }

  return true
}

mapKeys(rules, (func, name) => registerRule(func, name))

export default MJMLRulesCollection
