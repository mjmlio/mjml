const chai = require('chai')
const mjml = require('../lib')

const NBSP = ' '
const HAIR_SPACE = ' '

describe('character references when minifying', function () {
  this.timeout(10000)

  // ---------------------------------------------------------------------------
  // htmlnano's safe preset decodes character references to raw UTF-8 since 3.4.0.
  // mjml keeps them escaped so minified output survives ESP template engines and
  // transports that re-encode the payload.
  // ---------------------------------------------------------------------------

  it('keeps the &#8202; emitted by mj-spacer escaped', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-spacer height="50px" />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, { minify: true })
    chai.expect(html).to.include('&#8202;')
    chai.expect(html).to.not.include(HAIR_SPACE)
  })

  it('keeps character references in user content escaped', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Caf&eacute;&nbsp;&amp; co. &mdash; &copy;2026</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, { minify: true })
    chai.expect(html).to.include('Caf&eacute;&nbsp;&amp; co. &mdash; &copy;2026')
  })

  it('lets callers opt in through minifyOptions', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>a&nbsp;b</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, {
      minify: true,
      minifyOptions: { minifyCharacterReferences: true },
    })
    chai.expect(html).to.include(`a${NBSP}b`)
    chai.expect(html).to.not.include('a&nbsp;b')
  })
})
