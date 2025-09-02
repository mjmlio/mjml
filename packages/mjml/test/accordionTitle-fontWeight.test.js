const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

const input = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-accordion border="none" padding="1px" />
      <mj-accordion-element icon-wrapped-url="https://i.imgur.com/Xvw0vjq.png" icon-unwrapped-url="https://i.imgur.com/KKHenWa.png" icon-height="24px" icon-width="24px" />
      <mj-accordion-title font-family="Roboto, Open Sans, Helvetica, Arial, sans-serif" background-color="#fff" color="#031017" padding="15px" font-size="18px" />
      <mj-accordion-text font-family="Open Sans, Helvetica, Arial, sans-serif" background-color="#fafafa" padding="15px" color="#505050" font-size="14px" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-section padding="20px" background-color="#ffffff">
      <mj-column background-color="#dededd">
        <mj-accordion>
          <mj-accordion-element>
            <mj-accordion-title font-weight="bold" css-class="accordion-title">Why use an accordion?</mj-accordion-title>
            <mj-accordion-text font-weight="bold">
              <span style="line-height:20px">
                Because emails with a lot of content are most of the time a very bad experience on mobile, mj-accordion comes handy when you want to deliver a lot of information in a concise way.
              </span>
            </mj-accordion-text>
          </mj-accordion-element>
          <mj-accordion-element>
            <mj-accordion-title font-weight="700" css-class="accordion-title">How it works</mj-accordion-title>
            <mj-accordion-text font-weight="700">
              <span style="line-height:20px">
                Content is stacked into tabs and users can expand them at will. If responsive styles are not supported (mostly on desktop clients), tabs are then expanded and your content is readable at once.
              </span>
            </mj-accordion-text>
          </mj-accordion-element>
        </mj-accordion>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

const { html } = mjml(input)

const $ = load(html)

// style values should be correct
chai
  .expect(
    $('.accordion-title')
      .map(function getAttr() {
        const start = $(this).attr('style').indexOf('font-weight:') + 12
        const end = $(this).attr('style').indexOf(';', start)
        return $(this).attr('style').substring(start, end)
      })
      .get(),
    'Font-weight in CSS style values on accordion-title',
  )
  .to.eql(['bold', '700'])
