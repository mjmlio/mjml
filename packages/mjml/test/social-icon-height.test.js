const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-social icon-height', function () {
  it('should render correct icon-height align in CSS style values on mj-social', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column css-class="my-social-element">
            <mj-social icon-height="40px">
              <mj-social-element name="facebook" href="https://mjml.io/" css-class="my-social-element">
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

    // height values should be correct
    chai
      .expect(
        $('.my-social-element > td > table > tbody > tr > td')
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('height:') + 7
            const end = $(this).attr('style').indexOf(';', start)
            return $(this).attr('style').substring(start, end)
          })
          .get(),
        'icon-height values on social elements',
      )
      .to.eql(['40px'])

    chai
      .expect(
        $('.my-social-element > td > table > tbody > tr > td img')
          .map(function getAttr() {
            return $(this).attr('height')
          })
          .get(),
      )
      .to.satisfy((arr) => arr.every((val) => !val))
  })
})
