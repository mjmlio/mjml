const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

function headStyles(html) {
  const $ = load(html)
  return $('head style')
    .map(function () {
      return $(this).text()
    })
    .get()
    .join('\n')
}

function wrapWrapper(attrs = '', content = '<mj-section><mj-column><mj-text>Wrapper</mj-text></mj-column></mj-section>') {
  return `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-wrapper ${attrs}>
      ${content}
    </mj-wrapper>
  </mj-body>
</mjml>
`
}

describe('mj-wrapper dark-mode smoke', function () {
  it('should emit a dark background-color rule when wrapper has dark-background-color', async function () {
    const { html } = await mjml(
      wrapWrapper('background-color="#ffffff" dark-background-color="#111111"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const backgroundClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )

    chai.expect(backgroundClassMatch).to.not.equal(null)
    chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
    chai.expect($(`table.${backgroundClassMatch[1]}`).length).to.be.at.least(1)
  })

  it('should emit a dark background-image rule when wrapper has dark-background-url', async function () {
    const darkUrl = 'https://example.com/wrapper-dark.jpg'
    const { html } = await mjml(
      wrapWrapper(
        `background-url="https://example.com/wrapper-light.jpg" dark-background-url="${darkUrl}"`,
      ),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const backgroundImageClassMatch = styles.match(
      /\.(mj-dark-image-\d+) \{ background-image: url\("https:\/\/example\.com\/wrapper-dark\.jpg"\) !important; \}/,
    )

    chai.expect(backgroundImageClassMatch).to.not.equal(null)
    chai.expect(styles).to.include(darkUrl)
    chai.expect($(`table.${backgroundImageClassMatch[1]}`).length).to.be.at.least(1)
  })

  it('should emit wrapper and nested section dark color rules under one prefers-color-scheme block', async function () {
    const { html } = await mjml(
      wrapWrapper(
        'dark-background-color="#111111"',
        '<mj-section dark-border-color="#444444"><mj-column><mj-text>Nested</mj-text></mj-column></mj-section>',
      ),
    )
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.include('background-color: #111111 !important;')
    chai.expect(styles).to.include('border-color: #444444 !important;')
  })
})
