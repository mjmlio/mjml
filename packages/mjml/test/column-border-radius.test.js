const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

describe('mj-column border-radius', function () {
  it('should render correct border-radius / inner-border-radius (and border-collapse) in CSS style values on mj-column', async function () {
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

    const { html } = await mjml(input)

    const $ = load(html)

    // border radius values should be correct
    chai
      .expect(
        $(
          '.mj-column-per-100 > table > tbody > tr > td, .mj-column-per-100 > table > tbody > tr > td > table',
        )
          .map(function getAttr() {
            const style = $(this).attr('style')
            return extractStyle(style, 'border-radius')
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
            const style = $(this).attr('style')
            return extractStyle(style, 'border-collapse')
          })
          .get(),
        'Border-collapse in CSS style values on mj-column',
      )
      .to.eql(['separate', 'separate'])
  })
})
