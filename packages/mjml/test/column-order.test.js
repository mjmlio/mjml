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

  it('lets an explicit column-order override the document direction', async function () {
    const { html, errors } = await mjml(`
      <mjml dir="rtl">
        <mj-body>
          <mj-section column-order="ltr" gutter="24px">
            <mj-column><mj-text>First</mj-text></mj-column>
            <mj-column><mj-text>Second</mj-text></mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `)

    chai.expect(errors).to.eql([])
    chai.expect(html).to.include('mj-column-gutter-2-1-per-4"')
    chai.expect(html).to.not.include('mj-column-gutter-2-1-per-4-rtl')
  })
})
