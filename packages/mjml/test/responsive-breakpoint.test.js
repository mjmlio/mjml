const chai = require('chai')
const mjml = require('../lib')

function wrapMjml(head = '') {
  return `
    <mjml>
      <mj-head>
        ${head}
      </mj-head>
      <mj-body>
        <mj-section padding--responsive="12px">
          <mj-column>
            <mj-text>Content</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `
}

describe('responsive attribute breakpoint', () => {
  it('uses the default breakpoint', async () => {
    const { html } = await mjml(wrapMjml())

    chai.expect(html).to.contain('@media only screen and (max-width:479px)')
  })

  it('uses a custom mj-breakpoint width', async () => {
    const { html } = await mjml(wrapMjml('<mj-breakpoint width="600px" />'))

    chai.expect(html).to.contain('@media only screen and (max-width:599px)')
  })
})