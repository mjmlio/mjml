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

describe('mj-section background-url--dark', () => {
  it('should not emit dark background-image styles when no background-url--dark is set', async () => {
    const { html } = await mjml2html(wrapSection())
    const styles = headStyles(html)

    chai.expect(html).not.to.contain('mj-dark-image-')
    chai.expect(styles).not.to.match(/\.mj-dark-image-\d+\s*\{\s*background-image:/)
  })

  it('should apply background-url--dark to the regular section background table', async () => {
    const darkUrl = 'https://example.com/section-dark.jpg'
    const { html } = await mjml2html(wrapSection(`background-url--dark="${darkUrl}"`))
    const styles = headStyles(html)
    const $ = load(html)

    const backgroundImageClassMatch = styles.match(
      /\.(mj-dark-\d+) \{ background-image: url\("https:\/\/example\.com\/section-dark\.jpg"\) !important; \}/,
    )

    chai.expect(backgroundImageClassMatch).to.not.equal(null)

    const backgroundImageClassName = backgroundImageClassMatch[1]

    chai.expect($(`table.${backgroundImageClassName}`).length).to.equal(1)
    chai.expect($(`div.${backgroundImageClassName}`).length).to.equal(0)
    chai.expect(styles).to.not.contain(`[data-ogsb] .${backgroundImageClassName}`)
  })

  it('should apply background-url--dark to the full-width section table and preserve css-class', async () => {
    const darkUrl = 'https://example.com/section-dark.jpg'
    const { html } = await mjml2html(
      wrapSection(
        `full-width="full-width" css-class="section-root" background-url--dark="${darkUrl}"`,
      ),
    )
    const styles = headStyles(html)

    const backgroundImageClassMatch = styles.match(
      /\.(mj-dark-\d+) \{ background-image: url\("https:\/\/example\.com\/section-dark\.jpg"\) !important; \}/,
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
            background-url--dark="${darkUrlOne}"
          >
            <mj-column><mj-text>One</mj-text></mj-column>
          </mj-section>
          <mj-section
            background-url="https://example.com/section-light-two.jpg"
            background-url--dark="${darkUrlTwo}"
          >
            <mj-column><mj-text>Two</mj-text></mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml2html(input)
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    // Both sections' background-image rules must be coalesced into a single
    // shared block, not one block per section.
    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.contain(darkUrlOne)
    chai.expect(styles).to.contain(darkUrlTwo)
  })

  it('should coalesce a background-image rule with another section\'s background-color rule', async () => {
    const darkUrl = 'https://example.com/section-dark.jpg'

    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section
            background-url="https://example.com/section-light.jpg"
            background-url--dark="${darkUrl}"
          >
            <mj-column><mj-text>One</mj-text></mj-column>
          </mj-section>
          <mj-section background-color="#ffffff" background-color--dark="#111111">
            <mj-column><mj-text>Two</mj-text></mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml2html(input)
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.contain(darkUrl)
    chai.expect(styles).to.contain('background-color: #111111 !important;')
  })
})