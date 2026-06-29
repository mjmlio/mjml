const chai = require('chai')
const { load } = require('cheerio')

const mjml2html = require('../lib')

function headStyles(html) {
  const $ = load(html)

  return $('head style')
    .map(function () {
      return $(this).text()
    })
    .get()
    .join('\n')
}

function wrapHero(attrs = '') {
  return `
    <mjml support-dark-mode="true">
      <mj-body>
        <mj-hero
          mode="fixed-height"
          height="200px"
          background-width="600px"
          background-height="300px"
          background-color="#cccccc"
          background-url="https://example.com/hero-light.jpg"
          ${attrs}
        >
          <mj-text>Hello</mj-text>
        </mj-hero>
      </mj-body>
    </mjml>
  `
}

describe('mj-hero dark-background-url', () => {
  it('should not emit dark background-image styles when no dark-background-url is set', async () => {
    const { html } = await mjml2html(wrapHero())
    const styles = headStyles(html)

    chai.expect(html).not.to.contain('mj-dark-image-')
    chai.expect(styles).not.to.contain('@media (prefers-color-scheme: dark)')
    chai.expect(styles).not.to.match(/\.mj-dark-image-\d+\s*\{\s*background-image:/)
  })

  it('should apply dark-background-url to the hero mode td', async () => {
    const darkUrl = 'https://example.com/hero-dark.jpg'
    const { html } = await mjml2html(wrapHero(`dark-background-url="${darkUrl}"`))
    const styles = headStyles(html)
    const $ = load(html)

    const backgroundImageClassMatch = styles.match(
      /\.(mj-dark-image-\d+) \{ background-image: url\("https:\/\/example\.com\/hero-dark\.jpg"\) !important; \}/,
    )

    chai.expect(backgroundImageClassMatch).to.not.equal(null)

    const backgroundImageClassName = backgroundImageClassMatch[1]

    chai.expect($(`td.${backgroundImageClassName}`).length).to.equal(1)
    chai.expect($(`div.${backgroundImageClassName}`).length).to.equal(0)
    chai.expect(styles).to.not.contain(`[data-ogsb] .${backgroundImageClassName}`)
  })
})