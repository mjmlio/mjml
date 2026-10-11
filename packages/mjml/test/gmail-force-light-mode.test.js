const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

const template = (rootAttributes) => `
  <mjml ${rootAttributes}>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text color="#111111" color--dark="#ffffff">Hello</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`

describe('gmail-force-light-mode attribute', function () {
  it('should not add a color-scheme meta tag by default', async function () {
    const { html } = await mjml(template(''))
    const $ = load(html)

    chai.expect($('meta[name="color-scheme"]').get().length).to.equal(0)
  })

  it('should use "light only" meta and keep dark mode CSS with support-dark-mode="true"', async function () {
    const { html } = await mjml(
      template('support-dark-mode="true" gmail-force-light-mode="true"'),
    )
    const $ = load(html)

    chai
      .expect($('meta[name="color-scheme"]').attr('content'))
      .to.equal('light only')
    chai.expect($('meta[name="supported-color-schemes"]').get().length).to.equal(0)
    chai.expect(html).to.include(':root { color-scheme: light dark;')
    chai.expect(html).to.include('prefers-color-scheme: dark')
  })

  it('should use "light only" meta when set without support-dark-mode', async function () {
    const { html } = await mjml(template('gmail-force-light-mode="true"'), {
      validationLevel: 'skip',
    })
    const $ = load(html)

    chai
      .expect($('meta[name="color-scheme"]').attr('content'))
      .to.equal('light only')
    chai.expect(html).to.not.include(':root { color-scheme')
  })

  it('should ignore gmail-force-light-mode="false"', async function () {
    const { html } = await mjml(
      template('support-dark-mode="true" gmail-force-light-mode="false"'),
    )
    const $ = load(html)

    chai
      .expect($('meta[name="color-scheme"]').attr('content'))
      .to.equal('light dark')
  })

  describe('validator', function () {
    const WARNING = 'gmail-force-light-mode="true" is set, so Gmail apps will show light mode'

    const hasWarning = (errors) =>
      errors.some((e) => (e.message || '').includes(WARNING))

    it('warns once when --dark attributes are used with gmail-force-light-mode="true"', async function () {
      const { errors } = await mjml(
        template('support-dark-mode="true" gmail-force-light-mode="true"'),
      )

      chai
        .expect(errors.filter((e) => (e.message || '').includes(WARNING)))
        .to.have.lengthOf(1)
    })

    it('does not warn without --dark attributes', async function () {
      const { errors } = await mjml(`
        <mjml support-dark-mode="true" gmail-force-light-mode="true">
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text color="#111111">Hello</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `)

      chai.expect(hasWarning(errors)).to.equal(false)
    })

    it('does not warn when gmail-force-light-mode is not set', async function () {
      const { errors } = await mjml(template('support-dark-mode="true"'))

      chai.expect(hasWarning(errors)).to.equal(false)
    })
  })
})
