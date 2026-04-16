const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

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

    // width values should be correct
    chai
      .expect(
        $('.table table')
          .map(function getAttr() {
            return $(this).attr('width')
          })
          .get(),
        'Width values on tables',
      )
      .to.eql(['100%', '500', '80%', 'auto'])

    // style values should be correct
    chai
      .expect(
        $('.table table')
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('width:') + 6
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'Width in CSS style values on tables',
      )
      .to.eql(['100%', '500px', '80%', 'auto'])
  })
})
