import Type from './type'
import colors from '../helpers/colors'

export const matcher = /^color/gmi

export default params => class Color extends Type {
  constructor(color) {
    super(color)

    this.matchers = [
      /rgba\(\d{1,3},\d{1,3},\d{1,3},\d(\.\d)?\)/gi,
      /rgb\(\d{1,3},\d{1,3},\d{1,3}\)/gi,
      /^#([0-9a-f]{3}){1,2}$/gi,
      new RegExp(`^(${colors.join('|')})$`),
    ]
  }
}
