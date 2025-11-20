const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-accordion font-family inheritance', function () {
  it('should render correct font-family in CSS style values on accordion-title and accordion-text', async function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-accordion css-class="my-accordion-1" font-family="serif">
              <mj-accordion-element>
                <mj-accordion-title>Why use an accordion?</mj-accordion-title>
                <mj-accordion-text>
                    Because emails with a lot of content are most of the time a very bad experience on mobile, mj-accordion comes handy when you want to deliver a lot of information in a concise way.
                </mj-accordion-text>
              </mj-accordion-element>
            </mj-accordion>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-accordion css-class="my-accordion-2" font-family="serif">
              <mj-accordion-element font-family="sans-serif">
                <mj-accordion-title font-family="monospace">Why use an accordion?</mj-accordion-title>
                <mj-accordion-text font-family="monospace">
                    Because emails with a lot of content are most of the time a very bad experience on mobile, mj-accordion comes handy when you want to deliver a lot of information in a concise way.
                </mj-accordion-text>
              </mj-accordion-element>
            </mj-accordion>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = await mjml(input)

    const $ = load(html)

    // style values should be correct
    chai
      .expect(
        $(
          '.my-accordion-1 .mj-accordion-title td:first-child, .my-accordion-1 .mj-accordion-content td:first-child',
          '.my-accordion-2 .mj-accordion-title td:first-child, .my-accordion-2 .mj-accordion-content td:first-child, ',
        )
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('font-family:') + 12
            const end = $(this).attr('style').indexOf(';', start)
            const result = $(this).attr('style').substring(start, end)
            return result
          })
          .get(),
        'Font-family in CSS style values on accordion-title',
      )
      .to.eql(['serif', 'serif', 'monospace', 'monospace'])
  })
})
