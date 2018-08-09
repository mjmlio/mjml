import Type from './type'

export const matcher = /^boolean/gim

export default () =>
  class Boolean extends Type {
    constructor(boolean) {
      super(boolean)

      this.matchers = [/^true$/i, /^false$/i]
    }

    isValid() {
      return this.value === true || this.value === false
    }
  }
