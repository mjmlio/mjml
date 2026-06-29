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

function wrapNavbar(attrs = '', linkAttrs = '', linkText = 'Home') {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-navbar hamburger="hamburger" ${attrs}>
          <mj-navbar-link href="/home" color="#111111" ${linkAttrs}>${linkText}</mj-navbar-link>
        </mj-navbar>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-navbar dark-ico-color / mj-navbar-link dark-color', function () {
  it('should not emit dark-mode rules when no dark attributes are set', async function () {
    const { html } = await mjml(wrapNavbar())

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should apply dark-ico-color to the hamburger label', async function () {
    const { html } = await mjml(wrapNavbar('dark-ico-color="#ff0000"'))
    const styles = headStyles(html)
    const $ = load(html)

    const icoClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*color: #ff0000 !important;[^}]*\}/,
    )

    chai.expect(icoClassMatch).to.not.equal(null)

    const icoDarkClass = icoClassMatch[1]

    chai.expect($('.mj-menu-label').attr('class')).to.include(icoDarkClass)
    chai.expect($(`a.mj-link.${icoDarkClass}`).length).to.equal(0)
    chai.expect(styles).to.not.include(`[data-ogsb] .${icoDarkClass}`)
  })

  it('should apply dark-color to navbar links, not the hamburger label', async function () {
    const { html } = await mjml(wrapNavbar('', 'dark-color="#00ff00"'))
    const styles = headStyles(html)
    const $ = load(html)

    const linkClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*color: #00ff00 !important;[^}]*\}/,
    )

    chai.expect(linkClassMatch).to.not.equal(null)

    const linkDarkClass = linkClassMatch[1]

    chai.expect($(`a.mj-link.${linkDarkClass}`).length).to.equal(1)
    chai.expect(($('.mj-menu-label').attr('class') || '')).to.not.include(linkDarkClass)
  })

  it('should use separate dark classes for dark-ico-color and dark-color', async function () {
    const { html } = await mjml(
      wrapNavbar('dark-ico-color="#ff0000"', 'dark-color="#00ff00"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const icoClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*color: #ff0000 !important;[^}]*\}/,
    )
    const linkClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*color: #00ff00 !important;[^}]*\}/,
    )

    chai.expect(icoClassMatch).to.not.equal(null)
    chai.expect(linkClassMatch).to.not.equal(null)
    chai.expect(icoClassMatch[1]).to.not.equal(linkClassMatch[1])

    chai.expect(($('.mj-menu-label').attr('class') || '')).to.include(icoClassMatch[1])
    chai.expect($(`a.mj-link.${linkClassMatch[1]}`).length).to.equal(1)
  })

  it('should emit a single prefers-color-scheme block when multiple navbars register dark rules', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-navbar hamburger="hamburger" dark-ico-color="#ff0000">
          <mj-navbar-link href="/one" color="#111111">One</mj-navbar-link>
        </mj-navbar>
        <mj-navbar hamburger="hamburger">
          <mj-navbar-link href="/two" color="#111111" dark-color="#00ff00">Two</mj-navbar-link>
        </mj-navbar>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.include('color: #ff0000 !important;')
    chai.expect(styles).to.include('color: #00ff00 !important;')
  })
})
