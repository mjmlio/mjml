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

function wrapButton(attrs = '', content = 'Click') {
  return `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-button
          css-class="my-button"
          href="https://example.com"
          background-color="#f45e43"
          color="#ffffff"
          container-background-color="#eeeeee"
          border="2px solid #333333"
          ${attrs}
        >${content}</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-button color--dark / background-color--dark / border-color--dark / container-background-color--dark', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(wrapButton())

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should apply container-background-color--dark class to the wrapper td and preserve css-class', async function () {
    const { html } = await mjml(
      wrapButton('container-background-color--dark="#111111"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const containerClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )

    chai.expect(containerClassMatch).to.not.equal(null)

    const darkClass = containerClassMatch[1]

    chai.expect($('td.my-button').attr('class')).to.equal(`my-button ${darkClass}`)
    chai.expect($(`td[bgcolor].${darkClass}`).length).to.equal(0)
    chai.expect($(`a.${darkClass}`).length).to.equal(0)
  })

  it('should apply color--dark to the inner link, not the button td', async function () {
    const { html } = await mjml(wrapButton('color--dark="#00ff00"'))
    const styles = headStyles(html)
    const $ = load(html)

    const colorClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*color: #00ff00 !important;[^}]*\}/,
    )

    chai.expect(colorClassMatch).to.not.equal(null)

    const darkClass = colorClassMatch[1]

    chai.expect($(`a.${darkClass}`).length).to.equal(1)
    chai.expect($(`td[bgcolor].${darkClass}`).length).to.equal(0)
    chai.expect($(`td.my-button.${darkClass}`).length).to.equal(0)
  })

  it('should map background-color--dark and border-color--dark to button/content without leaking to wrapper', async function () {
    const { html } = await mjml(
      wrapButton('background-color--dark="#111111" border-color--dark="#ff0000"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('background-color: #111111 !important;')
    chai.expect(styles).to.include('border-color: #ff0000 !important;')

    const buttonTdClass = $('td[bgcolor="#f45e43"]').attr('class')
    const contentClass = $('a').attr('class')

    chai.expect(buttonTdClass).to.match(/mj-dark-\d+/)
    chai.expect(contentClass).to.match(/mj-dark-\d+/)
    chai.expect(buttonTdClass).to.not.equal(contentClass)
    chai.expect($('td.my-button').attr('class')).to.equal('my-button')
  })

  it('should use a single dark class for border-color--dark and side overrides on the button td', async function () {
    const { html } = await mjml(
      wrapButton(
        'border-color--dark="orange" border-top-color--dark="hotpink" border-bottom-color--dark="hotpink" border-left-color--dark="purple"',
      ),
    )
    const styles = headStyles(html)

    const borderColorClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: orange !important;[^}]*\}/,
    )
    const borderTopClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-top-color: hotpink !important;[^}]*\}/,
    )
    const borderBottomClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-bottom-color: hotpink !important;[^}]*\}/,
    )
    const borderLeftClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-left-color: purple !important;[^}]*\}/,
    )

    chai.expect(borderColorClass).to.not.equal(null)
    chai.expect(borderTopClass).to.not.equal(null)
    chai.expect(borderBottomClass).to.not.equal(null)
    chai.expect(borderLeftClass).to.not.equal(null)

    chai.expect(borderTopClass[1]).to.equal(borderColorClass[1])
    chai.expect(borderBottomClass[1]).to.equal(borderColorClass[1])
    chai.expect(borderLeftClass[1]).to.equal(borderColorClass[1])
  })

  it('should emit a single prefers-color-scheme block when multiple button dark rules are present', async function () {
    const { html } = await mjml(
      wrapButton(
        'container-background-color--dark="#111111" background-color--dark="#222222" border-color--dark="#ff0000" color--dark="#00ff00"',
      ),
    )
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.include('background-color: #111111 !important;')
    chai.expect(styles).to.include('background-color: #222222 !important;')
    chai.expect(styles).to.include('border-color: #ff0000 !important;')
    chai.expect(styles).to.include('color: #00ff00 !important;')
  })
})