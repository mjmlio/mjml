import { elements } from 'mjml-core'
import concat from 'lodash/concat'
import keys from 'lodash/keys'
import includes from 'lodash/includes'
import filter from 'lodash/filter'
import ruleError from './ruleError'

const WHITELIST = [ 'mj-class', 'css-class' ]

export const validateAttribute = (element) => {
  const { attributes, tagName } = element
  const Component = elements[tagName]

  if (!Component) {
    return;
  }

  const availableAttributes = concat(keys(Component.defaultMJMLDefinition.attributes), WHITELIST)
  const unknownAttributes = filter(keys(attributes), attribute => !includes(availableAttributes, attribute) )

  if (unknownAttributes.length == 0) {
    return;
  }

  return ruleError(`${unknownAttributes.length > 1 ? "Attributes" : "Attribute"} ${unknownAttributes.join(', ')} ${unknownAttributes.length > 1 ? "are illegal" : "is illegal"}`, element)
}
