import validAttributes from './rules/validAttributes'
import validChildren from './rules/validChildren'
import validTag from './rules/validTag'
import validTypes from './rules/validTypes'
import errorAttr from './rules/errorAttr'

const MJMLRulesCollection = {
  validAttributes,
  validChildren,
  validTag,
  validTypes,
  errorAttr,
}

export function registerRule(rule, name) {
  if (typeof rule !== 'function') {
    return console.error('Your rule must be a function')
  }

  if (name) {
    MJMLRulesCollection[name] = rule
  } else {
    MJMLRulesCollection[rule.name] = rule
  }

  return true
}

export default MJMLRulesCollection
