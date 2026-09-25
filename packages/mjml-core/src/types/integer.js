import Type from './type'

// `integer` or `integer(px)` (integer with an optional px unit)
export const matcher = /^integer/gim

export default (params) => {
  const allowPx = /\(px\)$/i.test(params)

  return class NInteger extends Type {
    static errorMessage = `has invalid value: $value for type Integer, only accepts integers${
      allowPx ? ' or px values (e.g. 6 or 6px)' : ''
    }`

    constructor(value) {
      super(value)

      this.matchers = [allowPx ? /^\d+(px)?$/ : /^\d+$/]
    }

    // normalize valid px values to a unitless integer (e.g. "6px" -> "6")
    getValue() {
      if (allowPx && /^\d+px$/.test(this.value)) {
        return this.value.slice(0, -2)
      }

      return this.value
    }
  }
}
