import Type from './type'

export const matcher = /^string/gim

export default params =>
  class NString extends Type {
    constructor(value) {
      super(value)

      this.matchers = [/.*/]
    }
  }
