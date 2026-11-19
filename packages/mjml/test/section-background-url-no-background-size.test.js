const chai = require('chai')
const mjml = require('../lib')

describe('mj-section background-url', function () {
  it('should not throw when background-size is omitted', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section background-url="https://example.com/bg.png" background-color="#ffffff">
            <mj-column>
              <mj-text>Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    chai.expect(html).to.include('https://example.com/bg.png')
    chai.expect(html).to.include('<v:fill')
  })

  it('should keep single quotes around background urls when beautifying output', async function () {
    const input = `
      <mjml>
        <mj-head>
          <mj-title>Background URL</mj-title>
        </mj-head>
        <mj-body>
          <mj-section
            background-url="https://example.com/bg.png"
            background-color="#ffffff"
            background-size="cover"
          >
            <mj-column>
              <mj-text>Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input, { beautify: true })

    chai.expect(html).to.include("url('https://example.com/bg.png')")
    chai.expect(html).to.not.include('url(&quot;https://example.com/bg.png&quot;)')
  })
})
