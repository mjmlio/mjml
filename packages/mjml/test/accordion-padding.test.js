const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

describe('mj-accordion padding-X', function () {
  it('should render correct padding in CSS style values on accordion-title and accordion-text', async function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-accordion>
              <mj-accordion-element>
                <mj-accordion-title padding="20px" padding-bottom="40px" padding-left="40px" padding-right="40px" padding-top="40px">Why use an accordion?</mj-accordion-title>
                <mj-accordion-text padding="20px" padding-bottom="40px" padding-left="40px" padding-right="40px" padding-top="40px">
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

    const paddings = [
      'padding-left',
      'padding-right',
      'padding-top',
      'padding-bottom',
    ]
    const results = paddings.map((padding) =>
      $(
        '.mj-accordion-title td:first-child, .mj-accordion-content td:first-child',
      )
        .map(function () {
          const style = $(this).attr('style')
          return extractStyle(style, padding)
        })
        .get(),
    )

    // Each padding should be ['40px', '40px']
    paddings.forEach((padding, idx) => {
      chai
        .expect(
          results[idx],
          `${padding} in CSS style values on accordion-title and accordion-text`,
        )
        .to.eql(['40px', '40px'])
    })
  })
})
