const chai = require('chai')
const mjml = require('../lib')

describe('support-outlook-classic attribute parsing', function () {
  it('should disable Outlook output when support-outlook-classic="false" (string)', async function () {
    const input = `
      <mjml support-outlook-classic="false">
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    chai
      .expect(html)
      .to.not.include('xmlns:o', 'xmlns:o namespace should be absent when support-outlook-classic="false"')
  })

  it('should enable Outlook output when support-outlook-classic="true" (string)', async function () {
    const input = `
      <mjml support-outlook-classic="true">
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    chai
      .expect(html)
      .to.include('xmlns:o', 'xmlns:o namespace should be present when support-outlook-classic="true"')
  })

  it('should enable Outlook output by default (no attribute)', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    chai
      .expect(html)
      .to.include('xmlns:o', 'xmlns:o namespace should be present by default')
  })
})
