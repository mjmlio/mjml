const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

describe('mj-table width', function () {
  it('should render correct width in CSS style values on mj-table', async function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-wrapper>
          <mj-section>
            <mj-column>
              <mj-table css-class="table">
                <tr>
                  <th style="border: 1px solid black;text-align: left;">
                    Default Width
                  </th>
                  <td style="border: 1px solid black;">
                    100%
                  </td>
                </tr>
              </mj-table>
            </mj-column>
          </mj-section>
          <mj-section>
            <mj-column>
              <mj-table width="500px" css-class="table">
                <tr>
                  <th style="border: 1px solid black;text-align: left;">
                     Pixel Width
                  </th>
                  <td style="border: 1px solid black;">
                    500px
                  </td>
                </tr>
              </mj-table>
            </mj-column>
          </mj-section>
          <mj-section>
            <mj-column>
              <mj-table width="80%" css-class="table">
                <tr>
                  <th style="border: 1px solid black;text-align: left;">
                    Percentage Width
                  </th>
                  <td style="border: 1px solid black;">
                    80%
                  </td>
                </tr>
              </mj-table>
            </mj-column>
          </mj-section>
          <mj-section css-class="section">
            <mj-column>
              <mj-table width="auto" css-class="table">
                <tr>
                  <th style="border: 1px solid black;text-align: left;">
                    Auto Width
                  </th>
                  <td style="border: 1px solid black;">
                    Auto
                  </td>
                </tr>
              </mj-table>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-body>
    </mjml>
    `

    const { html } = await mjml(input)

    const $ = load(html)

    // width values should be correct (attribute present or not)
    chai
      .expect(
        $('.table table')
          .toArray()
          .map((el) => $(el).attr('width')),
        'Width values on tables',
      )
      .to.eql(['100%', '500', '80%', undefined])

    // style values should be correct (CSS width present or not)
    chai
      .expect(
        $('.table table')
          .toArray()
          .map((el) => {
            const style = $(el).attr('style') || ''
            return extractStyle(style, 'width')
          }),
        'Width in CSS style values on tables',
      )
      .to.eql(['100%', '500px', '80%', undefined])
  })
})
