const chai = require('chai')
const { initializeType } = require('../lib/types/type')

describe('integer type', () => {
  const Integer = initializeType('integer')

  const valid = ['0', '6', '42', '100']
  const invalid = ['6px', 'abc5', '2 55', '-1', '1.5', '', ' ', 'px']

  valid.forEach((value) => {
    it(`accepts bare integer ${JSON.stringify(value)}`, () => {
      chai.expect(new Integer(value).isValid()).to.equal(true)
    })
  })

  invalid.forEach((value) => {
    it(`rejects non-integer ${JSON.stringify(value)}`, () => {
      chai.expect(new Integer(value).isValid()).to.equal(false)
    })
  })
})
