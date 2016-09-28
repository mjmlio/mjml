/**
 *
 *  mjml-chart test suite
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

describe('mjml-chart', () => {
  before(() => {
    registerMJElement(ChartComponent);
  })

  describe('compile-time error handling', () => {

    it('should crash at compile time in case of missing (cht) required attributes', () =>
      expect(() =>
        new MJMLRenderer(`
          <mjml>
          <mj-body>
          <mj-chart
          chs="300x200"
          chd="t:10,20,30|15,25,35"
          chxt="x,y"
          chxl="0:|A|B|C" />
          </mj-body>
          </mjml>`).render()
      ).to.throw('cht is required')
    )

    it('should crash at compile time in case of bad formatted attributes', () =>
      expect(() => {
        new MJMLRenderer(`
          <mjml>
          <mj-body>
          <mj-chart
          chs="300x200"
          chd="t:10,20,30|15,25,35"
          cht="aa"
          chxt="x,y"
          chxl="0:|A|B|C" />
          </mj-body>
          </mjml>`).render()
      }).to.throw('"aa" is not an valid value for cht. Valid values are: ["bvs","bhs","bvg","bhg","bvo","p","p3","pc","pd","ls","lc","lxy","ls:nda","lc:nda","lxy:nda"]')
    )

    it('should crash at compile time in case of forbidden attributes', () =>
      expect(() => {
        new MJMLRenderer(`
          <mjml>
          <mj-body>
          <mj-chart
          width="300"
          chs="300x200"
          chd="t:10,20,30|15,25,35"
          cht="bvs"
          chxt="x,y"
          chxl="0:|A|B|C" />
          </mj-body>
          </mjml>`).render()
      }).to.throw(`"width" is not an authorized attribute for <mjml-chart>`)
    )
  });

  describe('chart generation', () => {
    it('should render a mjml chart', () => {
      expect(new MJMLRenderer(`
          <mjml>
            <mj-body>
              <mj-chart
              chs="300x200"
              chd="t:10,20,30|15,25,35"
              cht="bvs"
              chxt="x,y"
              chxl="0:|A|B|C" />
            </mj-body>
          </mjml>`).render()).to.contain('<img height="200" src="https://image-charts.com/chart?cht=bvs&chd=t%3A10%2C20%2C30%7C15%2C25%2C35&chs=300x200" style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:200px;" width="300">')
    })

    it('should render mjml-image attributes', () => {
      expect(new MJMLRenderer(`
          <mjml>
            <mj-body>
              <mj-chart
              alt="alt"
              align="left"
              chs="300x200"
              chd="t:10,20,30|15,25,35"
              cht="bvg"
              chxt="x,y"
              chxl="0:|A|B|C" />
            </mj-body>
          </mjml>`).render()).to
        .contain(`align="left"`)
        .contain('<img alt="alt" height="200" src="https://image-charts.com/chart?cht=bvg&chd=t%3A10%2C20%2C30%7C15%2C25%2C35&chs=300x200" style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:200px;" width="300">')
    })
  })
})
