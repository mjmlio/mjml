const chai = require('chai')
const mjml = require('../lib')

describe('mj-button multiline', function () {
  it('should omit Outlook padding styles when classic Outlook support is disabled', async function () {
    const input = `
      <mjml support-outlook-classic="false">
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button multiline="true" padding="10px 20px">Button</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    chai.expect(html).to.include('display:inline-block;')
    chai.expect(html).to.not.include('mso-padding-alt')
  })
})
