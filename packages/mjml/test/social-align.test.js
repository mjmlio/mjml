const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-social-element align', function () {
  it('should render correct align in CSS style values on mj-social-element', function () {
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

    const { html } = mjml(input)

    const $ = load(html)

    // align values should be correct
    chai
      .expect(
        $('.my-social-element > td:first-child')
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('text-align:') + 11
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'align values on social elements',
      )
      .to.eql(['right'])
  })
})
