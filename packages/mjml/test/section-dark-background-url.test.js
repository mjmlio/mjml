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

function wrapSection(attrs = '') {
  return `
    <mjml support-dark-mode="true">
      <mj-body>
        <mj-section
          background-url="https://example.com/section-light.jpg"
          background-color="#cccccc"
          background-size="cover"
          ${attrs}
        >
          <mj-column>
            <mj-text>Hello</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `
}

describe('mj-section dark-background-url', () => {
  it('should not emit dark background-image styles when no dark-background-url is set', async () => {
    const { html } = await mjml2html(wrapSection())
    const styles = headStyles(html)

    chai.expect(html).not.to.contain('mj-dark-image-')
    chai.expect(styles).not.to.match(/\.mj-dark-image-\d+\s*\{\s*background-image:/)
  })

  it('should apply dark-background-url to the regular section background table', async () => {
    const darkUrl = 'https://example.com/section-dark.jpg'
    const { html } = await mjml2html(wrapSection(`dark-background-url="${darkUrl}"`))
    const styles = headStyles(html)
    const $ = load(html)

    const backgroundImageClassMatch = styles.match(
      /\.(mj-dark-image-\d+) \{ background-image: url\("https:\/\/example\.com\/section-dark\.jpg"\) !important; \}/,
    )

    chai.expect(backgroundImageClassMatch).to.not.equal(null)

    const backgroundImageClassName = backgroundImageClassMatch[1]

    chai.expect($(`table.${backgroundImageClassName}`).length).to.equal(1)
    chai.expect($(`div.${backgroundImageClassName}`).length).to.equal(0)
    chai.expect(styles).to.not.contain(`[data-ogsb] .${backgroundImageClassName}`)
  })

  it('should apply dark-background-url to the full-width section table and preserve css-class', async () => {
    const darkUrl = 'https://example.com/section-dark.jpg'
    const { html } = await mjml2html(
      wrapSection(
        `full-width="full-width" css-class="section-root" dark-background-url="${darkUrl}"`,
      ),
    )
    const styles = headStyles(html)

    const backgroundImageClassMatch = styles.match(
      /\.(mj-dark-image-\d+) \{ background-image: url\("https:\/\/example\.com\/section-dark\.jpg"\) !important; \}/,
    )

    chai.expect(backgroundImageClassMatch).to.not.equal(null)

    const backgroundImageClassName = backgroundImageClassMatch[1]
    chai.expect(html).to.contain(`class="section-root ${backgroundImageClassName}"`)
  })

  it('should emit dark background-image rules for multiple sections', async () => {
    const darkUrlOne = 'https://example.com/section-dark-one.jpg'
    const darkUrlTwo = 'https://example.com/section-dark-two.jpg'

    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section
            background-url="https://example.com/section-light-one.jpg"
            dark-background-url="${darkUrlOne}"
          >
            <mj-column><mj-text>One</mj-text></mj-column>
          </mj-section>
          <mj-section
            background-url="https://example.com/section-light-two.jpg"
            dark-background-url="${darkUrlTwo}"
          >
            <mj-column><mj-text>Two</mj-text></mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml2html(input)
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(2)
    chai.expect(styles).to.contain(darkUrlOne)
    chai.expect(styles).to.contain(darkUrlTwo)
  })
})