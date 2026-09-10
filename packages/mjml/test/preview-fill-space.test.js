const chai = require('chai')
const mjml = require('../lib')

describe('mj-preview fill-space', function () {
  async function renderPreview(attributes = '') {
    const input = `
      <mjml>
        <mj-head>
          <mj-preview${attributes}>Hello</mj-preview>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Body</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)
    return html.match(/<div style="display:none[^>]*>([\s\S]*?)<\/div>/)[1]
  }

  it('does not add filler by default', async function () {
    const preview = await renderPreview()

    chai.expect(preview).to.equal('Hello')
  })

  it('adds filler when enabled explicitly', async function () {
    const preview = await renderPreview(' fill-space="10"')

    chai.expect(preview).to.equal(`Hello${' &#847; '.repeat(10)}${' &shy;'.repeat(10)}`)
  })

  it('does not add filler for negative values', async function () {
    const preview = await renderPreview(' fill-space="-1"')

    chai.expect(preview).to.equal('Hello')
  })
})
