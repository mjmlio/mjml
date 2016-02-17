/**
 *
 *  MJML CLI test suite.
 *
 *
 *  Compile and run the tests:
 *    npm test
 *
 */
import fs from 'fs'
import path from 'path'
import fsp from 'fs-promise'
import { expect } from 'chai'
import mjmlCLI from '../src/cli'

/**
 * Simple formatting: isolate the '<' and '>' characters and change space and tabs to new lines
 * TODO:
 *  - This format function is the same as input-output.spec.js, maybe we can put them in the same place?
 */
const format = (input) => {
  if (input) {
    return input.toLowerCase().replace(/>/g, ' > ').replace(/</g, ' < ').match(/\S+/g).join('\n')
  }

  return null
}

/**
 * Compare two given files, returns a Promise.
 * Starts by reading the files using the promise version of fs, then formats it for an easy comparison
 */
const compareFiles = (fileToCompare, expectedFile) => {
  const files = [fileToCompare, expectedFile]

  return Promise.all(files.map(file => {
    return fsp.readFile(file, {encoding:'utf8'})
      .then(fileContent => format(fileContent))
  }))
    .then(filesContentFormatted => {
      expect(filesContentFormatted[0]).to.equal(filesContentFormatted[1])
    })
}

describe('MJML Command Line Interface', () => {
  const componentName = 'Mock'

  describe('init-component', () => {
    afterEach(function () {
      fs.unlink(`./${componentName}.js`)
    })

    it('should generate a component code', (done) => {
      mjmlCLI.initComponent(componentName, false, false).then(() => {
        compareFiles(`./${componentName}.js`, path.join(__dirname, 'assets/generatedComponent.js'))
          .then(done)
          .catch(done)
      })
    })

    it('should generate a component with ending tag', (done) => {
      mjmlCLI.initComponent(componentName, true, false).then(() => {
        compareFiles(`./${componentName}.js`, path.join(__dirname, 'assets/generatedComponentEndingTag.js'))
          .then(done)
          .catch(done)
      })
    })
  })
})
