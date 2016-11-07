import warning from 'warning'
import * as rules from './rules'

const MJMLRulesCollection = rules

export const registerMJRule = rule => {

  if (typeof rule != 'function' || rule.length !== 1) {
    warning(false, 'Your rule must be a function and must have one parameter which is the element to validate')
  }

  MJMLRulesCollection[rule.name] = rule;

}


export default MJMLRulesCollection
