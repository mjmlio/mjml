import Type from './type'

export const matcher = /^boolean/gim

export default () =>
  class Boolean extends Type {
    constructor(boolean) {
      super(boolean)

      this.matchers = [/^true$/i, /^false$/i]
    }

    getValue() {
      return !!this.value.match(/^true$/i)
    }
  }
