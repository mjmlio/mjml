const chai = require('chai')
const mjml = require('../lib')

describe('htmlmin:ignore comments', function () {
  this.timeout(10000)

  // ---------------------------------------------------------------------------
  // htmlmin:ignore — re-implemented for htmlnano
  // ---------------------------------------------------------------------------

  it('preserves content wrapped in <!-- htmlmin:ignore --> pairs when minifying', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <!-- htmlmin:ignore -->
                <div class="preserve   this   spacing">keep   whitespace</div>
                <!-- htmlmin:ignore -->
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, { minify: true })
    chai.expect(html).to.include('preserve   this   spacing')
    chai.expect(html).to.include('keep   whitespace')
    chai.expect(html).to.not.include('htmlmin:ignore')
  })

  it('preserves multiple <!-- htmlmin:ignore --> pairs independently when minifying', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <!-- htmlmin:ignore --><span id="first">  spaced  </span><!-- htmlmin:ignore -->
                <p>normal content</p>
                <!-- htmlmin:ignore --><span id="second">  also   spaced  </span><!-- htmlmin:ignore -->
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, { minify: true })
    chai.expect(html).to.include('  spaced  ')
    chai.expect(html).to.include('  also   spaced  ')
    chai.expect(html).to.not.include('htmlmin:ignore')
  })

  it('strips <!-- htmlmin:ignore --> markers (but keeps content) when beautifying', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <!-- htmlmin:ignore -->
                <div>preserved content</div>
                <!-- htmlmin:ignore -->
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, { beautify: true })
    chai.expect(html).to.include('preserved content')
    chai.expect(html).to.not.include('htmlmin:ignore')
  })
})
