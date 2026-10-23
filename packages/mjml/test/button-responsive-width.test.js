const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

function getResponsiveStyles(html) {
  const $ = load(html)

  return $('head style')
    .map(function getStyle() {
      return $(this).text()
    })
    .get()
    .join('\n')
}

describe('mj-button responsive width', function () {
  it('preserves the requested outer width with responsive inner padding', async function () {
    const { html } = await mjml(`
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button
                width="240px"
                width--responsive="200px"
                inner-padding="10px 25px"
                inner-padding--responsive="10px 30px"
              >Button</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `)
    const styles = getResponsiveStyles(html)

    chai.expect(styles).to.match(/\.mj-responsive-1 \{ width: 200px !important; \}/)
    chai.expect(styles).to.match(
      /\.mj-responsive-2 \{ width: 140px !important; padding: 9px 29px !important; \}/,
    )
  })
})