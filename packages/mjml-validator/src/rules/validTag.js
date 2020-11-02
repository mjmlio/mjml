import ruleError from './ruleError'

// Tags that have no associated components but are allowed even so
const componentLessTags = [
  'mj-all',
  'mj-class',
  'mj-selector',
  'mj-html-attribute',
]

export default function validateTag(element, { components }) {
  const { tagName } = element

  if (componentLessTags.includes(tagName)) return null

  const Component = components[tagName]

  if (!Component) {
    return ruleError(
      `Element ${tagName} doesn't exist or is not registered`,
      element,
    )
  }

  return null
}
