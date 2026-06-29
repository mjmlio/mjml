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

describe('mj-button dark-color / dark-background-color / dark-border-color / dark-container-background-color', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(wrapButton())

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should apply dark-container-background-color class to the wrapper td and preserve css-class', async function () {
    const { html } = await mjml(
      wrapButton('dark-container-background-color="#111111"'),
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

  it('should apply dark-color to the inner link, not the button td', async function () {
    const { html } = await mjml(wrapButton('dark-color="#00ff00"'))
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

  it('should map dark-background-color and dark-border-color to button/content without leaking to wrapper', async function () {
    const { html } = await mjml(
      wrapButton('dark-background-color="#111111" dark-border-color="#ff0000"'),
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

  it('should use a single dark class for dark-border-color and side overrides on the button td', async function () {
    const { html } = await mjml(
      wrapButton(
        'dark-border-color="orange" dark-border-top-color="hotpink" dark-border-bottom-color="hotpink" dark-border-left-color="purple"',
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
        'dark-container-background-color="#111111" dark-background-color="#222222" dark-border-color="#ff0000" dark-color="#00ff00"',
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