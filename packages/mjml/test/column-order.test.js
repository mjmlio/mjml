const chai = require('chai')
const mjml = require('../lib')

describe('column-order', function () {
  it('supports column-order on sections and groups with direction as an alias', async function () {
    const render = async (attribute) => {
      const input = `
        <mjml>
          <mj-body>
            <mj-section ${attribute}="rtl" gutter="24px">
              <mj-column>
                <mj-text>Section first</mj-text>
              </mj-column>
              <mj-column>
                <mj-text>Section second</mj-text>
              </mj-column>
            </mj-section>
            <mj-section ${attribute}="ltr" gutter="24px">
              <mj-group ${attribute}="rtl">
                <mj-column>
                  <mj-text>Group first</mj-text>
                </mj-column>
                <mj-column>
                  <mj-text>Group second</mj-text>
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
    chai.expect(columnOrderHtml).to.match(/mj-column-gutter-[^"]*-rtl/)
  })
})
