const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

describe('mj-social-element align', function () {
  it('should render correct align in CSS style values on mj-social-element', async function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-social mode="vertical">
              <mj-social-element name="facebook" href="https://mjml.io/" icon-position="right" align="right"css-class="my-social-element">
                Facebook
              </mj-social-element>
            </mj-social>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = await mjml(input)

    const $ = load(html)

    // align values should be correct
    chai
      .expect(
        $('.my-social-element > td:first-child')
          .map(function getAttr() {
            const style = $(this).attr('style')
            return extractStyle(style, 'text-align')
          })
          .get(),
        'align values on social elements',
      )
      .to.eql(['right'])
  })
})
