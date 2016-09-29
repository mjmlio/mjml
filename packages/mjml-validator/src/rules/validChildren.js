import { elements } from 'mjml-core'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import ruleError from './ruleError'

export const validChildren = (element) => {
  const { children, tagName } = element
  const Component = elements[tagName]

  if (!Component) {
    return;
  }

  if (!children || children.length == 0) {
    return;
  }

  return filter(children.map((child) => {
    const childTagName = child.tagName
    const ChildComponent = elements[childTagName]

    if (!ChildComponent) {
      return null;
    }

    if (includes(ChildComponent.parentTag, tagName)) {
      return null;
    }

    return ruleError(`${ChildComponent.tagName} cannot be used inside ${tagName}, only in: ${ChildComponent.parentTag.join(', ')}`, child)
  }))
}
