const chai = require('chai')
const widthParser = require('../lib/helpers/widthParser')

describe('widthParser', () => {
  const testValues = [
    {
      input: '1px',
      options: {},
      output: { parsedWidth: 1, unit: 'px' },
    },
    {
      input: '33.3px',
      options: {},
      output: { parsedWidth: 33, unit: 'px' },
    },
    {
      input: '33.3%',
      options: {},
      output: { parsedWidth: 33, unit: '%' },
    },
    {
      input: '33.3%',
      options: { parseFloatToInt: false },
      output: { parsedWidth: 33.3, unit: '%' },
    },
  ]

  testValues.forEach(({ input, options, output }, index) => {
    it(`parses widths correctly (case ${index + 1})`, () => {
      chai.expect(widthParser(input, options), 'widthParser test failed').to.deep.equal(output)
    })
  })
})
