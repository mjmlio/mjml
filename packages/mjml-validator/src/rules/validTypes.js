import ruleError from './ruleError'

export default function validateType(element, { components, initializeType }) {
  const { attributes, tagName } = element

  const Component = components[tagName]

  if (!Component) {
    return null
  }

  const errors = []

  for (const [attr, value] of Object.entries(attributes)) {
    const attrType =
      Component.allowedAttributes && Component.allowedAttributes[attr]
    if (!attrType) continue // attribute not allowed

    const TypeChecker = initializeType(attrType)
    const result = new TypeChecker(value)
    if (result.isValid()) continue
    errors.push(
      ruleError(`Attribute ${attr} ${result.getErrorMessage()}`, element),
    )
  }

  return errors
}
