const chai = require('chai')
const mjml = require('../lib')

function extractBlockAroundMarker(html, {
  marker,
  startToken,
  endToken,
  label,
}) {
  const markerIndex = html.indexOf(marker)
  chai.expect(markerIndex, `Missing marker for ${label}`).to.be.greaterThan(-1)

  const startIndex =
    startToken === marker ? markerIndex : html.lastIndexOf(startToken, markerIndex)
  chai.expect(startIndex, `Missing start token for ${label}`).to.be.greaterThan(-1)

  const endIndex = html.indexOf(endToken, markerIndex)
  chai.expect(endIndex, `Missing end token for ${label}`).to.be.greaterThan(-1)

  return html.slice(startIndex, endIndex + endToken.length)
}

async function renderVariants(input, options = {}) {
  const { html: plainHtml } = await mjml(input, { ...options, beautify: false })
  const { html: beautifiedHtml } = await mjml(input, {
    ...options,
    beautify: true,
  })

  return { plainHtml, beautifiedHtml }
}

describe('Beautify output', function () {
  this.timeout(10000)

  const beautifyFixtures = [
    {
      name: 'reformats generated mj-text style attributes',
      input: `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Hello beautify</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `,
      extract: (html) =>
        extractBlockAroundMarker(html, {
          marker: 'Hello beautify',
          startToken: '<div',
          endToken: '</div>',
          label: 'mj-text block',
        }),
      expectedPlain: [
        '<div',
        '         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;"',
        '      >Hello beautify</div>',
      ].join('\n'),
      expectedBeautified:
        '<div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">Hello beautify</div>',
    },
    {
      name: 'reformats outlook conditional blocks without changing their content',
      skipFragmentDiffCheck: true,
      input: `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Conditional comments should survive</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `,
      extract: (html) =>
        extractBlockAroundMarker(html, {
          marker: '<!--[if mso]>',
          startToken: '<!--[if mso]>',
          endToken: '<![endif]-->',
          label: 'outlook conditional block',
        }),
      expectedPlain: [
        '<!--[if mso]>',
        '    <noscript>',
        '    <xml>',
        '    <o:OfficeDocumentSettings>',
        '      <o:AllowPNG/>',
        '      <o:PixelsPerInch>96</o:PixelsPerInch>',
        '    </o:OfficeDocumentSettings>',
        '    </xml>',
        '    </noscript>',
        '    <![endif]-->',
      ].join('\n'),
      expectedBeautified: [
        '<!--[if mso]>',
        '    <noscript>',
        '    <xml>',
        '    <o:OfficeDocumentSettings>',
        '      <o:AllowPNG/>',
        '      <o:PixelsPerInch>96</o:PixelsPerInch>',
        '    </o:OfficeDocumentSettings>',
        '    </xml>',
        '    </noscript>',
        '    <![endif]-->',
      ].join('\n'),
    },
    {
      name: 'keeps raw html comment spacing while reindenting the surrounding block',
      input: `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-raw>
                  <div id="beautify-raw-comment"><!--   keep this spacing   --><span data-kind="raw">Raw</span></div>
                </mj-raw>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `,
      extract: (html) =>
        extractBlockAroundMarker(html, {
          marker: 'id="beautify-raw-comment"',
          startToken: '<tbody>',
          endToken: '</tbody>',
          label: 'raw comment block',
        }),
      expectedPlain: [
        '<tbody>',
        '          <div id="beautify-raw-comment"><!--   keep this spacing   --><span data-kind="raw">Raw</span></div>',
        '        </tbody>',
      ].join('\n'),
      expectedBeautified: [
        '<tbody>',
        '                      <div id="beautify-raw-comment"><!--   keep this spacing   --> <span data-kind="raw">Raw</span></div>',
        '                    </tbody>',
      ].join('\n'),
    },
    {
      name: 'wraps long raw html start tags according to prettier print width',
      input: `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-raw>
                  <div id="beautify-print-width-probe" data-alpha="${'a'.repeat(80)}" data-beta="${'b'.repeat(80)}" data-gamma="${'c'.repeat(80)}" data-delta="${'d'.repeat(80)}">Wrapped raw tag</div>
                </mj-raw>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `,
      extract: (html) =>
        extractBlockAroundMarker(html, {
          marker: 'id="beautify-print-width-probe"',
          startToken: '<div',
          endToken: '</div>',
          label: 'print width probe',
        }),
      expectedPlain:
        `<div id="beautify-print-width-probe" data-alpha="${'a'.repeat(80)}" data-beta="${'b'.repeat(80)}" data-gamma="${'c'.repeat(80)}" data-delta="${'d'.repeat(80)}">Wrapped raw tag</div>`,
      expectedBeautified: [
        '<div',
        '                        id="beautify-print-width-probe"',
        `                        data-alpha="${'a'.repeat(80)}"`,
        `                        data-beta="${'b'.repeat(80)}"`,
        `                        data-gamma="${'c'.repeat(80)}"`,
        `                        data-delta="${'d'.repeat(80)}"`,
        '                      >',
        '                        Wrapped raw tag',
        '                      </div>',
      ].join('\n'),
    },
  ]

  beautifyFixtures.forEach((fixture) => {
    it(fixture.name, async function () {
      const { plainHtml, beautifiedHtml } = await renderVariants(fixture.input)

      const plainFragment = fixture.extract(plainHtml)
      const beautifiedFragment = fixture.extract(beautifiedHtml)

      chai.expect(plainFragment, `${fixture.name} plain fragment`).to.equal(
        fixture.expectedPlain,
      )
      chai.expect(
        beautifiedFragment,
        `${fixture.name} beautified fragment`,
      ).to.equal(fixture.expectedBeautified)
      if (!fixture.skipFragmentDiffCheck) {
        chai.expect(
          beautifiedFragment,
          `${fixture.name} should differ from non-beautified output`,
        ).to.not.equal(plainFragment)
      }
      chai.expect(
        beautifiedHtml,
        `${fixture.name} should change the overall document`,
      ).to.not.equal(plainHtml)
    })
  })

  it('does not beautify when minify=true even if beautify is also enabled', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Minify wins</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html: plainHtml } = await mjml(input, { beautify: false })
    const { html: beautifiedHtml } = await mjml(input, { beautify: true })
    const { html: minifiedHtml } = await mjml(input, {
      beautify: true,
      minify: true,
    })

    chai.expect(beautifiedHtml).to.not.equal(plainHtml)
    chai.expect(minifiedHtml).to.match(/^<!doctype html><html\b/)
    chai.expect(minifiedHtml).to.not.equal(beautifiedHtml)
    chai.expect(minifiedHtml).to.not.include('\n      <noscript>\n')
    chai.expect(minifiedHtml.length).to.be.lessThan(beautifiedHtml.length)
  })
})
