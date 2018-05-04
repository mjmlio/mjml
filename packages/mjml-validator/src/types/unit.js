import escapeRegExp from 'lodash/escapeRegExp'
import Type from './type'

export const matcher = /^unit\(.*\)/gim

export default params => {
  const units = params.match(/\(([^)]+)\)/)[1].split(',')
  const argsMatch = params.match(/\{([^}]+)\}/)
  const args = argsMatch && argsMatch[1] && argsMatch[1].split(',') || ['1'] // defaults to 1

  return class Unit extends Type {
    static errorMessage = `Invalid value: $value for type Unit, only accepts (${units.join(
      ', ',
    )}) units and ${args.join(' to ')} member(s)`

    constructor(value) {
      super(value)

      this.matchers = [
        new RegExp(
          `^((\\d){1,}(${units.map(escapeRegExp).join('|')})( )?){${args.join(
            ',',
          )}}$`,
        ),
      ]
    }

    convertAs(unit = 'px', base) {}
  }
}
