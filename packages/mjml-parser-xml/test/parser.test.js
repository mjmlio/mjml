const chai = require('chai')
require('mjml')
const { components } = require('mjml-core')

const MJMLParser = require('../lib')
const { displayDiff, omitDeepLodash } = require('./test-utils')
const testValues = require('./test-values')

/*
  If a test fails, set MJML_PARSER_XML_DEBUG=1 to log diff details
*/

const shouldDebugDiff = process.env.MJML_PARSER_XML_DEBUG === '1'

const parse = (mjml) =>
  MJMLParser(mjml, {
    keepComments: true,
    components,
    filePath: '.',
    ignoreIncludes: false,
  })

describe('mjml-parser-xml', () => {
  testValues.forEach((testUnit) => {
    const { test, mjml, validJson } = testUnit

    it(test, () => {
      const parsed = parse(mjml)

      if (shouldDebugDiff) {
        displayDiff(
          omitDeepLodash(validJson, 'file'),
          omitDeepLodash(parsed, ['absoluteFilePath', 'file']),
        )
      }

      chai
        .expect(omitDeepLodash(validJson, 'file'), `${test} test failed`)
        .to.deep.equal(omitDeepLodash(parsed, ['absoluteFilePath', 'file']))
    })
  })
})
