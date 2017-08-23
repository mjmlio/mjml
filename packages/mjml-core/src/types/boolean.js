import Type from './type'

export const matcher = /^boolean/gmi

export default params => class Boolean extends Type {
  constructor(boolean) {
    super(boolean)

    this.matchers = [/^true$/i, /^false$/i]
  }

  getValue() {
    return !!boolean.match(/^true$/i)
  }
}
