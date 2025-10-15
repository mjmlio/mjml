const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-wrapper text-align', function () {
  it('should render correct text-align values in CSS style values on mj-wrapper', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-wrapper border="1px solid #000000" padding="50px 30px">
          <mj-section border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px" border-bottom="1px solid #aaaaaa">
            <mj-column border="1px solid #dddddd">
              <mj-text padding="20px" css-class="my-text-1a"> center </mj-text>
              <mj-text padding="20px" css-class="my-text-1b"> center </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
        <mj-wrapper border="1px solid #000000" padding="50px 30px">
          <mj-section border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px" border-bottom="1px solid #aaaaaa" text-align="right">
            <mj-column border="1px solid #dddddd">
              <mj-text padding="20px" css-class="my-text-2a"> right </mj-text>
              <mj-text padding="20px" align="left" css-class="my-text-2b"> left </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
        <mj-wrapper border="1px solid #000000" padding="50px 30px" text-align="left">
          <mj-section border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px" border-bottom="1px solid #aaaaaa">
            <mj-column border="1px solid #dddddd">
              <mj-text padding="20px" css-class="my-text-3a"> left </mj-text>
              <mj-text padding="20px" align="right" css-class="my-text-3b"> right </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
        <mj-wrapper border="1px solid #000000" padding="50px 30px" text-align="center">
          <mj-section border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px" border-bottom="1px solid #aaaaaa" text-align="right">
            <mj-column border="1px solid #dddddd">
              <mj-text padding="20px" css-class="my-text-4a"> right </mj-text>
              <mj-text padding="20px" align="left" css-class="my-text-4b"> left </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
        <mj-wrapper border="1px solid #000000" padding="50px 30px" text-align="right">
          <mj-section border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px" border-bottom="1px solid #aaaaaa">
            <mj-column border="1px solid #dddddd">
              <mj-text padding="20px" align="center" css-class="my-text-5a"> center </mj-text>
              <mj-text padding="20px" align="left" css-class="my-text-5b"> left </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-body>
    </mjml>
    `

    const { html } = mjml(input)

    const $ = load(html)

    // text-align values should be correct
    chai
      .expect(
        $(
          '.my-text-1a > div, .my-text-1b > div, .my-text-2a > div, .my-text-2b > div, .my-text-3a > div, .my-text-3b > div, .my-text-4a > div, .my-text-4b > div, .my-text-5a > div, .my-text-5b > div',
        )
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('text-align:') + 11
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'text-align values on table elements',
      )
      .to.eql([
        'center',
        'center',
        'right',
        'left',
        'left',
        'right',
        'right',
        'left',
        'center',
        'left',
      ])
  })
})
