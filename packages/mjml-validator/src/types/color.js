import Type from './type'
import colors from './helpers/colors'

export const matcher = /^color/gim

export default () =>
  class Color extends Type {
    constructor(color) {
      super(color)

      this.matchers = [
        /rgba\(\d{1,3},\s?\d{1,3},\s?\d{1,3},\s?\d(\.\d{1,3})?\)/gi,
        /rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)/gi,
        /^#([0-9a-f]{3}){1,2}$/gi,
        new RegExp(`^(${colors.join('|')})$`),
      ]
    }
  }
