import MJMLElementsCollection from '../MJMLElementsCollection'
import ruleError from './ruleError'

export const validateTag = (element) => {
  const { tagName } = element
  const Component = MJMLElementsCollection[tagName]

  if (!Component) {
    return ruleError(`Element ${tagName} doesn't exist or is not registered`, element)
  }
}
