const chai = require('chai')
const mjml = require('../lib')

describe('mj-section gutter', function () {
  it('should render gutter classes from mj-section and adjust desktop widths', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="4%">
            <mj-column>
              <mj-text>Left</mj-text>
            </mj-column>
            <mj-column>
              <mj-text>Right</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'section-level gutter should not produce validation errors').to.eql([])
    chai.expect(html).to.include('.mj-column-per-44 { width:44% !important; max-width: 44%; }')
    chai.expect(html).to.include('.mj-column-gutter-2-1-per-4 { padding: 0% 2% 0% 4% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-per-4 { padding: 0% 4% 0% 2% !important; }')
    chai.expect(html).to.include('class="mj-column-per-44 mj-column-gutter-2-1-per-4 mj-outlook-group-fix"')
    chai.expect(html).to.include('class="mj-column-per-44 mj-column-gutter-2-2-per-4 mj-outlook-group-fix"')
  })

  it('should render pixel gutter with pixel-width columns', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="20px">
            <mj-column width="250px">
              <mj-text>Left</mj-text>
            </mj-column>
            <mj-column width="250px">
              <mj-text>Right</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'pixel gutter with px columns should not produce validation errors').to.eql([])
    // 250px - (20px/2 + 20px/2) = 220px per column
    chai.expect(html).to.include('.mj-column-px-220 { width:220px !important; max-width: 220px; }')
    chai.expect(html).to.include('.mj-column-gutter-2-1-px-20 { padding: 0px 10px 0px 20px !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-px-20 { padding: 0px 20px 0px 10px !important; }')
  })

  it('should render three-column layout with pixel gutter', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="15px">
            <mj-column>
              <mj-text>One</mj-text>
            </mj-column>
            <mj-column>
              <mj-text>Two</mj-text>
            </mj-column>
            <mj-column>
              <mj-text>Three</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'three-column pixel gutter should not produce validation errors').to.eql([])
    // 15px is converted to percentage; position-aware padding for first, middle, last
    chai.expect(html).to.include('.mj-column-gutter-3-1-per-2-5 { padding: 0% 1.25% 0% 2.5% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-3-2-per-2-5 { padding: 0% 1.25% 0% 1.25% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-3-3-per-2-5 { padding: 0% 2.5% 0% 1.25% !important; }')
  })

  it('should handle mixed percentage columns with pixel gutter', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="10px">
            <mj-column width="60%">
              <mj-text>Wide</mj-text>
            </mj-column>
            <mj-column width="40%">
              <mj-text>Narrow</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'mixed width percentage with pixel gutter should not produce errors').to.eql([])
    // 10px converted to percentage; 60% becomes 57.5%, 40% becomes 37.5%
    chai.expect(html).to.include('.mj-column-per-57-5 { width:57.5% !important; max-width: 57.5%; }')
    chai.expect(html).to.include('.mj-column-per-37-5 { width:37.5% !important; max-width: 37.5%; }')
    // Padding in percentage with many decimals due to conversion
    chai.expect(html).to.include('.mj-column-gutter-2-1-per-1-666667 { padding: 0% 0.833333% 0% 1.666667% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-per-1-666667 { padding: 0% 1.666667% 0% 0.833333% !important; }')
  })

  it('should handle mixed pixel columns with percentage gutter', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="3%">
            <mj-column width="300px">
              <mj-text>Left</mj-text>
            </mj-column>
            <mj-column width="200px">
              <mj-text>Right</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'mixed pixel width with percentage gutter should not produce errors').to.eql([])
    // 3% of 600px = 18px gutter; 300px - 27px = 273px, 200px - 27px = 173px
    chai.expect(html).to.include('.mj-column-px-273 { width:273px !important; max-width: 273px; }')
    chai.expect(html).to.include('.mj-column-px-173 { width:173px !important; max-width: 173px; }')
    // Padding converted to px: 18px gutter
    chai.expect(html).to.include('.mj-column-gutter-2-1-px-18 { padding: 0px 9px 0px 18px !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-px-18 { padding: 0px 18px 0px 9px !important; }')
  })

  it('should handle mixed percentage gutter with default columns', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="5%">
            <mj-column>
              <mj-text>Col 1</mj-text>
            </mj-column>
            <mj-column>
              <mj-text>Col 2</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'percentage gutter with default columns should not produce errors').to.eql([])
    // Verify gutter padding classes are present
    chai.expect(html).to.include('.mj-column-gutter-2-1-per-5 { padding: 0% 2.5% 0% 5% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-per-5 { padding: 0% 5% 0% 2.5% !important; }')
  })
})