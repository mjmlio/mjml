const chai = require('chai')
const widthParser = require('../lib/helpers/widthParser')

const testValues = [
  {
    input: '1px',
    options: {},
    output: { parsedWidth: 1, unit: 'px'},
  },
  {
    input: '33.3px',
    options: {},
    output: { parsedWidth: 33, unit: 'px'},
  },
  {
    input: '33.3%',
    options: {},
    output: { parsedWidth: 33, unit: '%'},
  },
  {
    input: '33.3%',
    options: { parseFloatToInt: false },
    output: { parsedWidth: 33.3, unit: '%'},
  },
]

testValues.forEach(testUnit => {
  const { input, options, output } = testUnit

  chai.expect(widthParser(input, options), `widthParser test failed`)
      .to.deep.equal(output)
})
