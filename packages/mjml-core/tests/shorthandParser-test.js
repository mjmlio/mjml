const chai = require('chai')
const helper = require('../lib/helpers/shorthandParser')

const shorthandParser = helper && helper.default

const testValues = [
  {
    input: '1px',
    output: { top: 1, right: 1, bottom: 1, left: 1 },
  },
  {
    input: '1px 0',
    output: { top: 1, right: 0, bottom: 1, left: 0 },
  },
  {
    input: '1px 2px 3px',
    output: { top: 1, right: 2, bottom: 3, left: 2 },
  },
  {
    input: '1px 2px 3px 4px',
    output: { top: 1, right: 2, bottom: 3, left: 4 },
  },
]

testValues.forEach(testUnit => {
  const { input, output } = testUnit
  const directions = ['top', 'right', 'bottom', 'left']
  directions.forEach(dir => {
    chai.expect(shorthandParser(input, dir), `shorthandParser test failed`)
        .to.deep.equal(output[dir])
  })
})
