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
          background-url="https://example.com/hero.jpg"
          inner-background-color="#eeeeee"
          ${attrs}
        >
          <mj-text>Hello</mj-text>
        </mj-hero>
      </mj-body>
    </mjml>
  `
}

describe('mj-hero dark-background-color / dark-inner-background-color', () => {
  it('should not emit dark-mode styles when no dark attributes are set', async () => {
    const { html } = await mjml2html(wrapHero())

    chai.expect(html).not.to.contain('mj-dark-')
    chai.expect(html).not.to.contain('prefers-color-scheme')
  })

  it('should apply dark-background-color to the hero mode td, not the root div', async () => {
    const { html } = await mjml2html(wrapHero('dark-background-color="#111111"'))
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.contain('background-color: #111111')

    const backgroundClassMatch = styles.match(
      /\.(mj-dark-\d+) \{ background-color: #111111 !important; \}/,
    )
    chai.expect(backgroundClassMatch).to.not.equal(null)

    const backgroundClassName = backgroundClassMatch[1]

    chai.expect($(`div.${backgroundClassName}`).length).to.equal(0)
    chai.expect($(`td.${backgroundClassName}`).length).to.equal(1)
  })

  it('should apply dark-inner-background-color to the inner content div', async () => {
    const { html } = await mjml2html(wrapHero('dark-inner-background-color="#222222"'))
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.contain('background-color: #222222')

    const innerBackgroundClassMatch = styles.match(
      /\.(mj-dark-\d+) \{ background-color: #222222 !important; \}/,
    )
    chai.expect(innerBackgroundClassMatch).to.not.equal(null)

    const innerBackgroundClassName = innerBackgroundClassMatch[1]
    const innerDiv = $('div.mj-hero-content')

    chai.expect(innerDiv.length).to.equal(1)
    chai.expect(innerDiv.attr('class')).to.include('mj-hero-content')
    chai.expect(innerDiv.attr('class')).to.include(innerBackgroundClassName)
    chai.expect($(`td.${innerBackgroundClassName}`).length).to.equal(0)
  })

  it('should use separate classes for outer and inner hero backgrounds', async () => {
    const { html } = await mjml2html(
      wrapHero('dark-background-color="#111111" dark-inner-background-color="#222222"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const backgroundClassMatch = styles.match(
      /\.(mj-dark-\d+) \{ background-color: #111111 !important; \}/,
    )
    const innerBackgroundClassMatch = styles.match(
      /\.(mj-dark-\d+) \{ background-color: #222222 !important; \}/,
    )

    chai.expect(backgroundClassMatch).to.not.equal(null)
    chai.expect(innerBackgroundClassMatch).to.not.equal(null)
    chai.expect(backgroundClassMatch[1]).to.not.equal(innerBackgroundClassMatch[1])

    chai.expect($(`td.${backgroundClassMatch[1]}`).length).to.equal(1)
    chai.expect($(`div.${innerBackgroundClassMatch[1]}`).length).to.equal(1)
  })

  it('should apply dark-background-color and dark-background-url classes together on the hero mode td', async () => {
    const darkUrl = 'https://example.com/hero-dark-combined.jpg'

    const { html } = await mjml2html(
      wrapHero(`dark-background-color="#111111" dark-background-url="${darkUrl}"`),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const backgroundClassMatch = styles.match(
      /\.(mj-dark-\d+) \{ background-color: #111111 !important; \}/,
    )
    const backgroundImageClassMatch = styles.match(
      /\.(mj-dark-image-\d+) \{ background-image: url\("https:\/\/example\.com\/hero-dark-combined\.jpg"\) !important; \}/,
    )

    chai.expect(backgroundClassMatch).to.not.equal(null)
    chai.expect(backgroundImageClassMatch).to.not.equal(null)

    const modeTd = $('td').filter(function () {
      const className = $(this).attr('class') || ''
      return (
        className.includes(backgroundClassMatch[1]) &&
        className.includes(backgroundImageClassMatch[1])
      )
    })

    chai.expect(modeTd.length).to.equal(1)
  })
})