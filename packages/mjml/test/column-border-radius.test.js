const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-column border-radius', function () {
  it('should render correct border-radius / inner-border-radius (and border-collapse) in CSS style values on mj-column', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column border-radius="50px" inner-border-radius="40px" padding="50px" border="5px solid #000" inner-border="5px solid #666">
            <mj-text>Hello World</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = mjml(input)

    const $ = load(html)

    // border radius values should be correct
    chai
      .expect(
        $(
          '.mj-column-per-100 > table > tbody > tr > td, .mj-column-per-100 > table > tbody > tr > td > table',
        )
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('border-radius:') + 14
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'Border-radius / inner-border-radius in CSS style values on mj-column',
      )
      .to.eql(['50px', '40px'])

    // border collapse values should be correct
    chai
      .expect(
        $(
          '.mj-column-per-100 > table > tbody > tr > td, .mj-column-per-100 > table > tbody > tr > td > table',
        )
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('border-collapse:') + 16
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'Border-collapse in CSS style values on mj-column',
      )
      .to.eql(['separate', 'separate'])
  })
})
