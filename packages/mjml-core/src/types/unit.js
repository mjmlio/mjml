import Type from './type'
import escapeRegExp from 'lodash/escapeRegExp'

export const matcher = /^unit\(.*\)/gmi

export default (params) => {
  const units = params.match(/\(([^)]+)\)/)[1].split(',')
  const args = params.match(/\{([^}]+)\}/)[1].split(',')

  return class Unit extends Type {
    constructor (value) {
      super(value)

      this.matchers = [ new RegExp(`^((\\d){1,}(${units.map(escapeRegExp).join('|')})( )?){${args.join(',')}}$`) ]
    }

    convertAs (unit = 'px', base) {
    }
  }
}