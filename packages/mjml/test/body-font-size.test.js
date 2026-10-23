const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

describe('mj-body wrapper div - font-size declaration', function () {

  it('should emit both font-size fallback declarations on the body wrapper div', async function () {
    const input = `
<mjml>
  <mj-body background-color="#f4f4f4">
    <mj-section>
      <mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)
    const style = $('body > div[role="article"]').attr('style')

    chai.expect(style).to.include('font-size:medium;font-size:max(16px, 1rem);')
  })
})
