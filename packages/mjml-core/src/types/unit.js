import escapeRegExp from 'lodash/escapeRegExp'
import Type from './type'

export const matcher = /^unit\(.*\)/gmi

export default (params) => {
  const units = params.match(/\(([^)]+)\)/)[1].split(',')
  const args = params.match(/\{([^}]+)\}/)[1].split(',')

  return class Unit extends Type {
    static errorMessage = `Invalid value: $value for type Unit, only accepts (${units.join(', ')}) units and ${args.join(' to ')} members`

    constructor(value) {
      super(value)

      this.matchers = [new RegExp(`^((\\d){1,}(${units.map(escapeRegExp).join('|')})( )?){${args.join(',')}}$`)]
    }

    convertAs(unit = 'px', base) {
    }
  }
}
