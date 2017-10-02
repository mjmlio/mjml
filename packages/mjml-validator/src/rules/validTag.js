import ruleError from './ruleError'

export default function validateTag(element, { components }) {
  const { tagName } = element

  const Component = components[tagName]

  if (!Component) {
    return ruleError(
      `Element ${tagName} doesn't exist or is not registered`,
      element,
    )
  }

  return null
}
