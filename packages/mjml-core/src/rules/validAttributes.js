import MJMLElementsCollection from '../MJMLElementsCollection'
import keys from 'lodash/keys'
import includes from 'lodash/includes'
import filter from 'lodash/filter'
import ruleError from './ruleError'

export const validateAttribute = (element) => {
  const { attributes, tagName } = element
  const Component = MJMLElementsCollection[tagName]

  if (!Component) {
    return;
  }

  const avalaibleAttributes = keys(Component.defaultMJMLDefinition.attributes)
  const unknownAttributes = filter(keys(attributes), attribute => !includes(avalaibleAttributes, attribute))

  if (unknownAttributes.length == 0) {
    return;
  }

  return ruleError(`Attributes ${unknownAttributes.join(', ')} ${unknownAttributes.length > 1 ? "are illegals" : "is illegal"}`, element)
}
