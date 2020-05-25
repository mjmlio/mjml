import { concat, keys, includes, filter } from 'lodash'

import ruleError from './ruleError'

const WHITELIST = ['mj-class', 'css-class']

export default function validateAttribute(element, { components }) {
  const { attributes, tagName } = element

  const Component = components[tagName]

  if (!Component) {
    return null
  }

  const availableAttributes = concat(
    keys(Component.allowedAttributes),
    WHITELIST,
  )
  const unknownAttributes = filter(
    keys(attributes),
    attribute => !includes(availableAttributes, attribute),
  )

  if (unknownAttributes.length === 0) {
    return null
  }

  const { attribute, illegal } = {
    attribute: unknownAttributes.length > 1 ? 'Attributes' : 'Attribute',
    illegal: unknownAttributes.length > 1 ? 'are illegal' : 'is illegal',
  }

  return ruleError(
    `${attribute} ${unknownAttributes.join(', ')} ${illegal}`,
    element,
  )
}
