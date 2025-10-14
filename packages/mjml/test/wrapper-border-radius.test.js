const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-wrapper and mj-section border-radius', function () {
  it('should render correct border-radius (and border-collapse) in CSS style values on mj-wrapper and mj-section', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-wrapper border="1px solid red" border-radius="10px">
          <mj-section>
            <mj-column>
              <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
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
        $('body > div > div > table:first-child > tbody > tr > td')
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('border-radius:') + 14
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'Border-radius in CSS style values on mj-wrapper',
      )
      .to.eql(['10px'])

    // border collapse values should be correct
    chai
      .expect(
        $('body > div > div > table:first-child')
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
