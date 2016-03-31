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
import { MJMLRenderer, registerMJElement, elements } from '../src/index'
import MockComponent from './MockComponent'

describe('MJML Renderer', () => {

  // Test invalid MJML files
  describe('Invalid MJML', () => {
    it('should throw if no elements registered', () => {
      //pending
    })
  })

  describe('Partial MJML registered', () => {
    it('should warn user that document will not be entirely parsed', () => {
      //pending
    })
  })

  describe('Full MJML registered', () => {
    it('should render a MJML document', () => {
      //pending
    })
  })

  describe('Register a component', () => {
    it('should return true when registering a new component', () => {
      registerMJElement(MockComponent)
      expect(elements).to.have.property('mj-mock')
    })
  })

})
