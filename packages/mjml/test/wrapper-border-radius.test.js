const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-wrapper and mj-section border-radius', function () {
  it('should render correct border-radius (and border-collapse) in CSS style values on mj-wrapper and mj-section', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-wrapper border="1px solid #000000" padding="50px 30px" border-radius="10px" background-color="#ccc" css-class="my-wrapper">
          <mj-section  border="5px solid #f00" padding="20px" border-radius="25px" background-color="#000" css-class="my-section>
            <mj-column>
              <mj-text> First line of text </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-body>
    </mjml>
    `

    const { html } = mjml(input)

    const $ = load(html)

    // border radius values should be correct
    chai
      .expect(
        $(
          '.my-wrapper, .my-wrapper > table, .my-wrapper > table > tbody > tr > td, .my-section, .my-section > table, .my-section > table > tbody > tr > td',
        )
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('border-radius:') + 14
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'Border-radius in CSS style values on mj-wrapper',
      )
      .to.eql(['10px', '10px', '10px'])

    // border collapse values should be correct
    chai
      .expect(
        $('.my-wrapper > table, .my-section > table')
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('border-collapse:') + 16
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'Border-collapse in CSS style values on mj-wrapper',
      )
      .to.eql(['separate'])
  })
})
