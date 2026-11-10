const chai = require('chai')
const mjml = require('../lib')

describe('column-order', function () {
  it('supports column-order on sections and groups with direction as an alias', async function () {
    const render = async (attribute) => {
      const input = `
        <mjml>
          <mj-body>
            <mj-section ${attribute}="rtl">
              <mj-group ${attribute}="ltr">
                <mj-column>
                  <mj-text>First</mj-text>
                </mj-column>
                <mj-column>
                  <mj-text>Second</mj-text>
                </mj-column>
              </mj-group>
            </mj-section>
          </mj-body>
        </mjml>
      `

      return mjml(input)
    }

    const { html: columnOrderHtml, errors: columnOrderErrors } =
      await render('column-order')
    const { html: directionHtml, errors: directionErrors } =
      await render('direction')

    chai.expect(columnOrderErrors).to.eql([])
    chai.expect(directionErrors).to.eql([])
    chai.expect(columnOrderHtml).to.equal(directionHtml)
  })
})
