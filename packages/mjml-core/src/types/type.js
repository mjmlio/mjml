import some from 'lodash/some'
import find from 'lodash/find'
import typesConstructors from './index'

// Avoid recreate existing types
export const types = {}

export const initializeType = (typeConfig) => {
  if (types[typeConfig]) {
    return types[typeConfig]
  }

  const { typeConstructor } = find(typesConstructors, (type) => !!typeConfig.match(type.matcher)) || {}

  if (!typeConstructor) {
    throw new Error(`No type found for ${typeConfig}`)
  }

  types[typeConfig] = typeConstructor(typeConfig)

  return types[typeConfig]
}

export default class Type {
  constructor (value) {
    this.value = value
  }

  isValid () {
    return some(this.matchers, (matcher) => this.value.match(matcher))
  }

  static check (type) {
    return !!type.match(this.constructor.typeChecker)
  }

  getValue () {
    return this.value
  }
}