/**
 *
 *  MJML engine test suite.
 *
 *  Adding a test:
 *    create an mjml file <name>.mjml in the assets folder
 *    create an expected output file <name>.html in the same folder
 *
 *  Compile and run the tests:
 *    npm test
 *
 */
import { expect } from 'chai'
import { mjml2html, registerElement } from '../src/index'
import fs from 'fs'
import path from 'path'

/*
  Simple formatting:
    isolate the '<' and '>' characters and change space and tabs to new lines
*/
const format = input => input ? input.toLowerCase().replace(/>/g, ' > ').replace(/</g, ' < ').match(/\S+/g).join('\n') : null

/**
 * Normalize the html contents with cheerio and compares the two html contents
 *
 * TODO:
 *   - pretty diff when it doesn't match
 *   - use a good formatting instead of the cheerio parsing
 */
const compare = (input, output, file) => {
  const $input  = format(input)
  const $output = format(output)

  return it(`should be strictly equal for file ${file}`, () => expect($input).to.equal($output))
}

/**
 * Load the test cases x.mjml/x.html located in the directory passed as a parameter.
 * Returns an array of functions that take an engine and return the comparaison
 * of the expected results and the actual results
 */
const testCases = directory => {
  const assets = file => path.join(__dirname, `${directory}/${file}`)
  const files = fs.readdirSync(path.join(__dirname, directory))

  return files

    // Keep the mjml files only
    .filter(file => file.indexOf('.mjml') > -1)

    // For each of them find the corresponding html and trigger compare
    .map(file => engine => {
      const input = fs.readFileSync(assets(file)).toString()
      const output = fs.readFileSync(assets(file.replace('.mjml', '.html'))).toString()

      return compare(engine(input, { beautify: true }), output, file)
    })
}

/**
 * Main mocha process
 */
describe('MJML mjml2html test', () => {

  // Compares mjml/html files in the assets folder
  describe('raw translation', () => testCases('./assets').map(compare => compare(mjml2html)))

  // Test invalid MJML files
  describe('Invalid MJML', () => {
    it('should throw if no mj-body specified', () => {
      const failingFn = () => mjml2html('<mj-text>Hello</mj-text>')
      expect(failingFn).to.throw()
    })
  })

  describe('Register a component', () => {
    it('should return true when registering a new component', () => {
      expect(registerElement('mock', {})).to.be.true
    })
  })

})
