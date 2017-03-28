import { flattenComponents } from 'mjml-core'
import ruleError from './ruleError'

export const validateTag = (element) => {
  const { tagName } = element
  const components = flattenComponents()
  const Component = components[tagName]

  if (!Component) {
    return ruleError(`Element ${tagName} doesn't exist or is not registered`, element)
  }
}
