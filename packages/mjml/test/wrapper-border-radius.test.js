const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

const input = `
<mjml>
  <mj-body>
    <mj-wrapper border="1px solid red" border-radius="10px">
      <mj-section>
        <mj-column>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
`

const { html } = mjml(input)

const $ = load(html)

// border radius values should be correct
chai
  .expect(
    $(
      'body > div > div > table:first-child > tbody > tr > td, body > div > div',
    )
      .map(function getAttr() {
        const start = $(this).attr('style').indexOf('border-radius:') + 14
        const end = $(this).attr('style').indexOf(';', start)
        return $(this).attr('style').substring(start, end)
      })
      .get(),
    'Border-radius in CSS style values on mj-wrapper',
  )
  .to.eql(['10px', '10px'])

// overflow value should be correct
chai
  .expect(
    $('body > div > div')
      .map(function getAttr() {
        const start = $(this).attr('style').indexOf('overflow:') + 9
        const end = $(this).attr('style').indexOf(';', start)
        return $(this).attr('style').substring(start, end)
      })
      .get(),
    'Overflow in CSS style values on mj-wrapper',
  )
  .to.eql(['hidden'])

// border collapse values should be correct
chai
  .expect(
    $('body > div > div > table:first-child')
      .map(function getAttr() {
        const start = $(this).attr('style').indexOf('border-collapse:') + 16
        const end = $(this).attr('style').indexOf(';', start)
        return $(this).attr('style').substring(start, end)
      })
      .get(),
    'Border-collapse in CSS style values on mj-wrapper',
  )
  .to.eql(['separate'])
