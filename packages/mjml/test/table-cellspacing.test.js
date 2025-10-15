const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-table cellspacing', function () {
  it('should render correct cellspacing (and border-collapse) in HTML tag / CSS style values on mj-table', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-table border="1px solid #000" width="auto" cellpadding="20" cellspacing="10" css-class="my-table">
              <tr style="border-bottom:1px solid #000;text-align:left;">
                <th style="background:#ddd;">Year</th>
                <th style="background:#ddd;">Language</th>
                <th style="background:#ddd;">Inspired from</th>
              </tr>
              <tr>
                <td style="background:#ddd;">1995</td>
                <td style="background:#ddd;">PHP</td>
                <td style="background:#ddd;">C, Shell Unix</td>
              </tr>
            </mj-table>
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
        $('.my-table > table')
          .map(function getAttr() {
            return $(this).attr('cellspacing')
          })
          .get(),
        'cellspacing values on table elements',
      )
      .to.eql(['10'])

    // border collapse values should be correct
    chai
      .expect(
        $('.my-table > table')
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('border-collapse:') + 16
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'Border-collapse in CSS style values on mj-table',
      )
      .to.eql(['separate'])
  })
})
