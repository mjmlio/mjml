import Type from './type'
import escapeRegExp from 'lodash/escapeRegExp'

export const matcher = /^enum/gmi

export default (params) => {
  const matchers = params.match(/\(([^)]+)\)/)[1].split(',')

  return class Enum extends Type {
    constructor (value) {
      super(value)

      this.matchers = matchers.map(m => new RegExp(`^${escapeRegExp(m)}$`))
    }
  }
}