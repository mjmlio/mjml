import MJMLElementsCollection from '../MJMLElementsCollection'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import ruleError from './ruleError'

export const validChildren = (element) => {
  const { children, tagName } = element
  const Component = MJMLElementsCollection[tagName]

  if (!Component) {
    return;
  }

  if (!children || children.length == 0) {
    return;
  }

  return filter(children.map((child) => {
    const childTagName = child.tagName
    const ChildComponent = MJMLElementsCollection[childTagName]

    if (!ChildComponent) {
      return null;
    }

    if (includes(ChildComponent.parentTag, tagName)) {
      return null;
    }

    return ruleError(`Cannot be used inside ${tagName}, only in : ${ChildComponent.parentTag.join(', ')}`, child)
  }))
}
