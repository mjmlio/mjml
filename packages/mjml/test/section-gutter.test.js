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
    chai.expect(html).to.include('.mj-column-per-48 { width:48% !important; max-width: 48%; }')
    chai.expect(html).to.include('.mj-column-gutter-2-1-per-4 { padding: 0% 2% 0% 0% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-per-4 { padding: 0% 0% 0% 2% !important; }')
    chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-1-per-4 mj-outlook-group-fix"')
    chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-2-per-4 mj-outlook-group-fix"')
  })

  it('should keep rtl gutter rules isolated from ltr section gutter rules', async function () {
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
          <mj-section gutter="4%">
            <mj-group direction="rtl">
              <mj-column>
                <mj-text>Group Left</mj-text>
              </mj-column>
              <mj-column>
                <mj-text>Group Right</mj-text>
              </mj-column>
            </mj-group>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'rtl gutter should not produce validation errors').to.eql([])
    chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-1-per-4 mj-outlook-group-fix"')
    chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-2-per-4 mj-outlook-group-fix"')
    chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-1-per-4-rtl mj-outlook-group-fix"')
    chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-2-per-4-rtl mj-outlook-group-fix"')
    chai.expect(html).to.include('mj-column-gutter-2-1-per-4-rtl')
    chai.expect(html).to.include('mj-column-gutter-2-2-per-4-rtl')
  })

  it('should not emit group gutter padding media-query rules when gutter is already inline', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="4%" padding="4%">
            <mj-group>
              <mj-column>
                <mj-text>Group Left</mj-text>
              </mj-column>
              <mj-column>
                <mj-text>Group Right</mj-text>
              </mj-column>
            </mj-group>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'group gutter case should not produce validation errors').to.eql([])
    chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-1-per-4 mj-outlook-group-fix"')
    chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-2-per-4 mj-outlook-group-fix"')
    chai.expect(html).to.include('style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:48%;padding:0% 2% 0% 0%;"')
    chai.expect(html).to.include('style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:48%;padding:0% 0% 0% 2%;"')
    chai.expect(html).to.not.include('.mj-column-gutter-2-1-per-4 { padding: 0% 2% 0% 0% !important; }')
    chai.expect(html).to.not.include('.mj-column-gutter-2-2-per-4 { padding: 0% 0% 0% 2% !important; }')
  })

  describe('advanced combinations', function () {
    it('should support section full-width border padding and rtl direction with gutter', async function () {
      const input = `
        <mjml>
          <mj-body>
            <mj-section full-width="full-width" background-color="#f2f2f2" gutter="4%" padding="4%" border="10px solid black" direction="rtl">
              <mj-column>
                <mj-text>S10-C1</mj-text>
              </mj-column>
              <mj-column>
                <mj-text>S10-C2</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `

      const { html, errors } = await mjml(input)

      chai.expect(errors, 'section full-width + border + rtl should not produce errors').to.eql([])
      chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-1-per-4-rtl mj-outlook-group-fix"')
      chai.expect(html).to.include('class="mj-column-per-48 mj-column-gutter-2-2-per-4-rtl mj-outlook-group-fix"')
      chai.expect(html).to.include('.mj-column-gutter-2-1-per-4-rtl { padding: 0% 0% 0% 2% !important; }')
      chai.expect(html).to.include('.mj-column-gutter-2-2-per-4-rtl { padding: 0% 2% 0% 0% !important; }')
    })

    it('should apply group direction over section direction for gutter classes', async function () {
      const input = `
        <mjml>
          <mj-body>
            <mj-section background-color="#f2f2f2" gutter="24px" padding="24px" direction="rtl">
              <mj-group direction="ltr">
                <mj-column>
                  <mj-text>S13-G1-C1</mj-text>
                </mj-column>
                <mj-column>
                  <mj-text>S13-G1-C2</mj-text>
                </mj-column>
                <mj-column>
                  <mj-text>S13-G1-C3</mj-text>
                </mj-column>
              </mj-group>
            </mj-section>
          </mj-body>
        </mjml>
      `

      const { html, errors } = await mjml(input)

      chai.expect(errors, 'group direction override should not produce errors').to.eql([])
      chai.expect(html).to.include('class="mj-column-per-30-434783 mj-column-gutter-3-1-per-4-347826 mj-outlook-group-fix"')
      chai.expect(html).to.include('class="mj-column-per-30-434783 mj-column-gutter-3-2-per-4-347826 mj-outlook-group-fix"')
      chai.expect(html).to.include('class="mj-column-per-30-434783 mj-column-gutter-3-3-per-4-347826 mj-outlook-group-fix"')
      chai.expect(html).to.not.include('mj-column-gutter-3-1-per-4-347826-rtl')
    })

    it('should keep gutter calculation stable with per-column direction border padding and inner-border', async function () {
      const input = `
        <mjml>
          <mj-body>
            <mj-section background-color="#f2f2f2" gutter="4%" padding="4%">
              <mj-column direction="rtl" border="4px solid #2f855a" padding="20px" inner-border="4px solid #276749">
                <mj-text>A</mj-text>
              </mj-column>
              <mj-column direction="ltr" border="2px dashed #744210" padding="8px" inner-border="3px solid #975a16">
                <mj-text>B</mj-text>
              </mj-column>
              <mj-column direction="rtl" border="1px solid #2c5282" padding="16px" inner-border="2px solid #2b6cb0">
                <mj-text>C</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `

      const { html, errors } = await mjml(input)

      chai.expect(errors, 'column-level border/padding/inner-border with gutter should not error').to.eql([])
      chai.expect(html).to.include('class="mj-column-per-30-666667 mj-column-gutter-3-1-per-4 mj-outlook-group-fix"')
      chai.expect(html).to.include('class="mj-column-per-30-666667 mj-column-gutter-3-2-per-4 mj-outlook-group-fix"')
      chai.expect(html).to.include('class="mj-column-per-30-666667 mj-column-gutter-3-3-per-4 mj-outlook-group-fix"')
    })

    it('should support four-column px widths with percentage gutter and balanced px rounding', async function () {
      const input = `
        <mjml>
          <mj-body>
            <mj-section background-color="#f2f2f2" gutter="2%" padding="4%">
              <mj-column width="120px">
                <mj-text>1</mj-text>
              </mj-column>
              <mj-column width="120px">
                <mj-text>2</mj-text>
              </mj-column>
              <mj-column width="120px">
                <mj-text>3</mj-text>
              </mj-column>
              <mj-column width="120px">
                <mj-text>4</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `

      const { html, errors } = await mjml(input)

      chai.expect(errors, 'four-column px rounding scenario should not produce errors').to.eql([])
      chai.expect(html).to.include('class="mj-column-px-111 mj-column-gutter-4-1-px-12 mj-outlook-group-fix"')
      chai.expect(html).to.include('class="mj-column-px-111 mj-column-gutter-4-2-px-12 mj-outlook-group-fix"')
      chai.expect(html).to.include('class="mj-column-px-111 mj-column-gutter-4-3-px-12 mj-outlook-group-fix"')
      chai.expect(html).to.include('class="mj-column-px-111 mj-column-gutter-4-4-px-12 mj-outlook-group-fix"')
      chai.expect(html).to.include('.mj-column-gutter-4-1-px-12 { padding: 0px 6px 0px 0px !important; }')
      chai.expect(html).to.include('mj-column-gutter-4-2-px-12')
      chai.expect(html).to.include('.mj-column-gutter-4-4-px-12 { padding: 0px 0px 0px 6px !important; }')
    })
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
    // 250px - (20px / 2) = 240px per column
    chai.expect(html).to.include('.mj-column-px-240 { width:240px !important; max-width: 240px; }')
    chai.expect(html).to.include('.mj-column-gutter-2-1-px-20 { padding: 0px 10px 0px 0px !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-px-20 { padding: 0px 0px 0px 10px !important; }')
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
    chai.expect(html).to.include('.mj-column-gutter-3-1-per-2-5 { padding: 0% 1.25% 0% 0% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-3-2-per-2-5 { padding: 0% 1.25% 0% 1.25% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-3-3-per-2-5 { padding: 0% 0% 0% 1.25% !important; }')
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
    // 10px converted to percentage; 60% becomes 59.166667%, 40% becomes 39.166667%
    chai.expect(html).to.include('.mj-column-per-59-166667 { width:59.166667% !important; max-width: 59.166667%; }')
    chai.expect(html).to.include('.mj-column-per-39-166667 { width:39.166667% !important; max-width: 39.166667%; }')
    // Padding in percentage with many decimals due to conversion
    chai.expect(html).to.include('.mj-column-gutter-2-1-per-1-666667 { padding: 0% 0.833333% 0% 0% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-per-1-666667 { padding: 0% 0% 0% 0.833333% !important; }')
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
    // 3% of 600px = 18px gutter; 300px - 9px = 291px, 200px - 9px = 191px
    chai.expect(html).to.include('.mj-column-px-291 { width:291px !important; max-width: 291px; }')
    chai.expect(html).to.include('.mj-column-px-191 { width:191px !important; max-width: 191px; }')
    // Padding converted to px: 18px gutter
    chai.expect(html).to.include('.mj-column-gutter-2-1-px-18 { padding: 0px 9px 0px 0px !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-px-18 { padding: 0px 0px 0px 9px !important; }')
  })

  it('should round decimal pixel outputs when percentage gutter is applied to px columns', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="4%" padding="4%">
            <mj-column width="200px">
              <mj-text>One</mj-text>
            </mj-column>
            <mj-column width="200px">
              <mj-text>Two</mj-text>
            </mj-column>
            <mj-column width="200px">
              <mj-text>Three</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'decimal px values should be rounded without validation errors').to.eql([])
    chai.expect(html).to.include('.mj-column-px-185 { width:185px !important; max-width: 185px; }')
    chai.expect(html).to.include('.mj-column-px-184 { width:184px !important; max-width: 184px; }')
    chai.expect(html).to.include('.mj-column-gutter-3-1-px-24 { padding: 0px 12px 0px 0px !important; }')
    chai.expect(html).to.include('.mj-column-gutter-3-2-px-24 { padding: 0px 12px 0px 12px !important; }')
    chai.expect(html).to.include('.mj-column-gutter-3-3-px-24 { padding: 0px 0px 0px 12px !important; }')
    chai.expect(html).to.not.include('185.28px')
    chai.expect(html).to.not.include('11.04px')
    chai.expect(html).to.not.include('303.6px')
  })

  it('should pair px gutter rounding and balance px widths when rounded gutter is odd', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section gutter="3.9%" padding="4%">
            <mj-column width="200px">
              <mj-text>One</mj-text>
            </mj-column>
            <mj-column width="200px">
              <mj-text>Two</mj-text>
            </mj-column>
            <mj-column width="200px">
              <mj-text>Three</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html, errors } = await mjml(input)

    chai.expect(errors, 'odd rounded px gutter should not produce validation errors').to.eql([])
    chai.expect(html).to.include('.mj-column-gutter-3-1-px-23 { padding: 0px 12px 0px 0px !important; }')
    chai.expect(html).to.include('.mj-column-gutter-3-2-px-23 { padding: 0px 12px 0px 11px !important; }')
    chai.expect(html).to.include('.mj-column-gutter-3-3-px-23 { padding: 0px 0px 0px 11px !important; }')

    // Width rounding is distributed across siblings so total width remains consistent
    chai.expect(html).to.include('.mj-column-px-185 { width:185px !important; max-width: 185px; }')
    chai.expect(html).to.include('.mj-column-px-184 { width:184px !important; max-width: 184px; }')
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
    chai.expect(html).to.include('.mj-column-gutter-2-1-per-5 { padding: 0% 2.5% 0% 0% !important; }')
    chai.expect(html).to.include('.mj-column-gutter-2-2-per-5 { padding: 0% 0% 0% 2.5% !important; }')
  })
})