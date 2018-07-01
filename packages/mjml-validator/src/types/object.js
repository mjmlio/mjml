import Type from './type'

export const matcher = /^object/gim

export default () =>
  class NObject extends Type {
    constructor(value) {
      super(value)

      this.matchers = [/{.*}/]
    }
  }
