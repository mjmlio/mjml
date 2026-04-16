const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

describe('mj-wrapper gap', function () {
  it('should render correct gap values in CSS style values on children mj-section', async function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-wrapper gap="20px" css-class="my-wrapper" background-color="#000"> 
          <mj-section css-class="my-section" background-color="#f45e43" padding="10px">
            <mj-column>
              <mj-text>Section 1</mj-text>
            </mj-column>
          </mj-section>
          <mj-section css-class="my-section" background-color="#ccc" padding="10px">
            <mj-column>
              <mj-text>Section 2</mj-text>
            </mj-column>
          </mj-section>
          <mj-section css-class="my-section" background-color="#333" padding="10px">
            <mj-column>
              <mj-text color="#fff">Section 3</mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-body>
    </mjml>
    `

    const { html } = await mjml(input)

    const $ = load(html)

    // gap values should be correct
    chai
      .expect(
        $('.my-section')
          .map(function getAttr() {
            const str = $(this).attr('style')
            const substr = 'margin-top:'

            if (str.includes(substr)) {
              const style = $(this).attr('style')
              return extractStyle(style, 'margin-top')
            }
            return undefined
          })
          .get(),
        'Gap in CSS style values on mj-wrapper',
      )
      .to.eql(['20px', '20px'])
  })
})
