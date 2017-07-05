import Type from './type'

export const matcher = /^string/gmi

export default (params) => {
  return class NString extends Type {
    constructor (value) {
      super(value)

      this.matchers = [ /.*/ ]
    }
  }
}
