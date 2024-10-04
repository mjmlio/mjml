import MJMLParser from '../src/index.js'
import mjml from 'mjml'
import { components } from 'mjml-core'
import chai from 'chai'
import { displayDiff, omitDeepLodash } from './test-utils'
import testValues from './test-values'

/*
  If test fails, run it with --debug to log the details of the diff
*/

const parse = mjml =>
  MJMLParser(mjml, {
    keepComments: true,
    components,
    filePath: '.'
  })

testValues.forEach(testUnit => {
  const { test, mjml, validJson } = testUnit

  if (process.argv.indexOf('--debug') !== -1) {
    displayDiff(omitDeepLodash(validJson, 'file'), omitDeepLodash(parse(mjml), ['absoluteFilePath', 'file']))
  }

  chai
    .expect(omitDeepLodash(validJson, 'file'), `${test} test failed`)
    .to.deep.equal(omitDeepLodash(parse(mjml), ['absoluteFilePath', 'file']))
})
