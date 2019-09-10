import { get } from 'lodash'
import ruleError from './ruleError'

export default function erroAttr(element, { components }) {
  const { attributes } = element
  const error = get(attributes, 'mj-error')
  
  if (!error) return null

  return ruleError(
    error,
    element,
  )
}
