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
import MockListComponent from './MockListComponent'

describe('MJML Renderer', () => {
  describe('Register a component', () => {
    it('should return true when registering a new component', () => {
      registerMJElement(MockListComponent)
      expect(elements).to.have.property('mj-mock-list')
    })
  })

  // Test invalid MJML files
  describe('Invalid MJML', () => {
    it('should throw if no elements registered', () => {
      expect(() => new MJMLRenderer(`
        <mjml validate="none">
          <mj-body>
            <mj-container>
              <mj-column />
            </mj-container>
          </mj-body>
        </mjml>`).render()
      ).to.throw(/EmptyMJMLError/)
    })
  })

  describe('Partial MJML registered', () => {
    it('should warn user that document will not be entirely parsed', () => {
      expect(new MJMLRenderer(`
        <mjml validate="none">
          <mj-body>
            <mj-mock-list>
              <mj-mock />
            </mj-mock-list>
          </mj-body>
        </mjml>`).render()
      ).to.not.contain('Mocked Component!')
    })
  })

  describe('Full MJML registered', () => {
    it('should render a MJML document', () => {
      registerMJElement(MockComponent)
      expect(new MJMLRenderer(`
        <mjml validate="none">
          <mj-body>
            <mj-mock-list>
              <mj-mock />
            </mj-mock-list>
          </mj-body>
        </mjml>`).render()
      ).to.contain('Mocked Component!')
    })
  })
})
