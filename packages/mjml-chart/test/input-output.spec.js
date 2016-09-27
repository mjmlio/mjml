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
import {
  expect
} from 'chai'
import {
  MJMLRenderer,
  registerMJElement
} from '../../mjml-core/src'
import ChartComponent from '../src'

describe('MJML Renderer', () => {

  describe('Full MJML registered', () => {
    it('should render a MJML chart', () => {
      registerMJElement(ChartComponent)
      expect(new MJMLRenderer(`
        <mjml>
          <mj-body>
            <mj-chart chs="300x200" chd="t:10,20,30|15,25,35" cht="bvs" chxt="x,y" chxl="0:|A|B|C" />
          </mj-body>
        </mjml>`).render()
      ).to.contain('t:10,20,30|15,25,35')
    })
  })
})
