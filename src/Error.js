
/*
 * Create a custom Error class
 */
const error = (name, code) => {

  return class MJMLError extends Error {

    constructor (message) {
      super(`[MJMLError] ${name}: ${message}`)
      this.status = code
    }
  }
}

/*
 * Warnings are printed to stderr
 */
/* eslint-disable no-unused-vars */
const warning = (name) => {
  return (message) => {
    console.error(`[MJMLWarning] ${name}: ${message}`)
  }
}
/* eslint-enable no-unused-vars */

/*
 * Error while parsing the code with cheerio
 */
export const ParseError = error('ParseError', 1)

/*
 * Error when encounter an empty MJML Element that should be filled
 */
export const EmptyMJMLError = error('EmptyMJMLError', 2)

/*
 * Triggered when an MJML is anormally null/udefined
 */
export const NullElementError = error('EmptyMJMLError', 3)

/*
 * When encounter an unknown MJML Element while transpiling
 */
export const UnknownMJMLElement = error('UnknownMJMLElement', 5)

/*
 * TODO: Warnings
 */
