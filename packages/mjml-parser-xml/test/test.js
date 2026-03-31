const MJMLParser = require('../lib/index.js')
require('mjml')
const components = require('mjml-core').components
const chai = require('chai')
const displayDiff = require('./test-utils').displayDiff
const omitDeepLodash = require('./test-utils').omitDeepLodash
const testValues = require('./test-values')

/*
  If test fails, run it with --debug to log the details of the diff
*/

const parse = mjml => MJMLParser(mjml, {
  keepComments: true,
  components,
  filePath: '.'
})

testValues.forEach(testUnit => {
  const { test, mjml, validJson } = testUnit

  if (process.argv.indexOf('--debug') !== -1) {
    displayDiff(omitDeepLodash(validJson, 'file'), omitDeepLodash(parse(mjml), ['absoluteFilePath', 'file']))
  }

  chai.expect(omitDeepLodash(validJson, 'file'), `${test} test failed`)
      .to.deep.equal(omitDeepLodash(parse(mjml), ['absoluteFilePath', 'file']))
})

/*
  Path traversal security tests (CVE-2020-12827)
*/

const securityTests = [
  {
    name: 'Relative path traversal in mj-include',
    mjml: '<mjml><mj-body><mj-section><mj-include path="../../../../etc/passwd" /></mj-section></mj-body></mjml>',
    expectedError: /within the project directory/,
  },
  {
    name: 'Absolute path in mj-include',
    mjml: '<mjml><mj-body><mj-section><mj-include path="/etc/passwd" /></mj-section></mj-body></mjml>',
    expectedError: /absolute paths are not allowed/,
  },
  {
    name: 'URL-encoded traversal in mj-include',
    mjml: '<mjml><mj-body><mj-section><mj-include path="%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd" /></mj-section></mj-body></mjml>',
    expectedError: /within the project directory/,
  },
  {
    name: 'Relative traversal in CSS include',
    mjml: '<mjml><mj-body><mj-section><mj-include path="../../../../etc/passwd" type="css" /></mj-section></mj-body></mjml>',
    expectedError: /within the project directory/,
  },
  {
    name: 'Relative traversal in HTML include',
    mjml: '<mjml><mj-body><mj-section><mj-include path="../../../../etc/passwd" type="html" /></mj-section></mj-body></mjml>',
    expectedError: /within the project directory/,
  },
  {
    name: 'Absolute path in CSS include',
    mjml: '<mjml><mj-body><mj-section><mj-include path="/etc/passwd" type="css" /></mj-section></mj-body></mjml>',
    expectedError: /absolute paths are not allowed/,
  },
]

securityTests.forEach(({ name, mjml, expectedError }) => {
  chai.expect(
    () => parse(mjml),
    `Security test failed: ${name}`,
  ).to.throw(expectedError)
})

// Verify error messages do not leak resolved filesystem paths
try {
  parse('<mjml><mj-body><mj-section><mj-include path="../../../../etc/passwd" /></mj-section></mj-body></mjml>')
  throw new Error('Security test failed: expected traversal to throw')
} catch (e) {
  chai.expect(e.message).to.not.match(/\/etc\/passwd/)
  chai.expect(e.message).to.not.match(/\/home\//)
  chai.expect(e.message).to.not.match(/\/Users\//)
}

console.log('All security tests passed (CVE-2020-12827)') // eslint-disable-line no-console
