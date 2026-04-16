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

function wrapText(attrs, content = 'Hello dark world') {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text ${attrs}>${content}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-text dark-color / dark-container-background-color', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(wrapText('color="#000000"'))

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  describe('dark-color', function () {
    it('should emit a color rule in the dark-mode style block', async function () {
      const { html } = await mjml(wrapText('color="#000000" dark-color="#ffffff"'))
      const styles = headStyles(html)
      const colorClassMatch = styles.match(
        /\.(mj-dark-\d+) \{[^}]*color: #ffffff !important;[^}]*\}/,
      )

      chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
      chai.expect(colorClassMatch).to.not.equal(null)
      chai.expect(styles).to.not.include(`[data-ogsb] .${colorClassMatch[1]} { color: #ffffff !important; }`)
    })

    it('should apply the dark class to the inner content div', async function () {
      const { html } = await mjml(wrapText('color="#000000" dark-color="#ffffff"'))
      const styles = headStyles(html)
      const $ = load(html)

      const colorClassMatch = styles.match(
        /\.(mj-dark-\d+) \{[^}]*color: #ffffff !important;[^}]*\}/,
      )

      chai.expect(colorClassMatch).to.not.equal(null)

      chai.expect($(`div.${colorClassMatch[1]}`).get().length).to.equal(1)
    })

    it('should NOT add the dark class to the wrapper <td>', async function () {
      const { html } = await mjml(wrapText('color="#000000" dark-color="#ffffff"'))
      const styles = headStyles(html)
      const $ = load(html)

      const colorClassMatch = styles.match(
        /\.(mj-dark-\d+) \{[^}]*color: #ffffff !important;[^}]*\}/,
      )

      chai.expect(colorClassMatch).to.not.equal(null)

      chai.expect($(`td.${colorClassMatch[1]}`).get().length).to.equal(0)
    })
  })

  describe('dark-containerbackground-color', function () {
    it('should emit a background-color rule in the dark-mode style block', async function () {
      const { html } = await mjml(
        wrapText('container-background-color="#ffffff" dark-container-background-color="#1a1a1a"'),
      )
      const styles = headStyles(html)
      const containerClassMatch = styles.match(
        /\.(mj-dark-\d+) \{[^}]*background-color: #1a1a1a !important;[^}]*\}/,
      )

      chai.expect(containerClassMatch).to.not.equal(null)
      chai.expect(styles).to.not.include(`[data-ogsb] .${containerClassMatch[1]} { background-color: #1a1a1a !important; }`)
    })

    it('should apply the dark class to the column wrapper <td>', async function () {
      const { html } = await mjml(
        wrapText('dark-container-background-color="#1a1a1a"'),
      )
      const styles = headStyles(html)
      const $ = load(html)

      const containerClassMatch = styles.match(
        /\.(mj-dark-\d+) \{[^}]*background-color: #1a1a1a !important;[^}]*\}/,
      )

      chai.expect(containerClassMatch).to.not.equal(null)

      chai.expect($(`td.${containerClassMatch[1]}`).get().length).to.equal(1)
    })

    it('should NOT add the dark class to the inner content div', async function () {
      const { html } = await mjml(
        wrapText('dark-container-background-color="#1a1a1a"'),
      )
      const styles = headStyles(html)
      const $ = load(html)

      const containerClassMatch = styles.match(
        /\.(mj-dark-\d+) \{[^}]*background-color: #1a1a1a !important;[^}]*\}/,
      )

      chai.expect(containerClassMatch).to.not.equal(null)

      chai.expect($(`div.${containerClassMatch[1]}`).get().length).to.equal(0)
    })

    it('should preserve an existing css-class when merging the dark class', async function () {
      const { html } = await mjml(
        wrapText('css-class="my-text" dark-container-background-color="#1a1a1a"'),
      )
      const styles = headStyles(html)
      const $ = load(html)

      const containerClassMatch = styles.match(
        /\.(mj-dark-\d+) \{[^}]*background-color: #1a1a1a !important;[^}]*\}/,
      )

      chai.expect(containerClassMatch).to.not.equal(null)

      chai.expect($('td.my-text').attr('class')).to.equal(`my-text ${containerClassMatch[1]}`)
    })
  })

  describe('dark-color and dark-container-background-color together', function () {
    it('should assign sequential class numbers and emit both rules', async function () {
      const { html } = await mjml(
        wrapText('dark-container-background-color="#1a1a1a" dark-color="#ffffff"'),
      )
      const styles = headStyles(html)
      const $ = load(html)

      // container registers first (getAttribute is called before render)
      chai
        .expect(styles)
        .to.include('.mj-dark-1 { background-color: #1a1a1a !important; }')
      chai
        .expect(styles)
        .to.include('.mj-dark-2 { color: #ffffff !important; }')
      chai.expect(styles).to.not.include('[data-ogsb] .mj-dark-1')
      chai.expect(styles).to.not.include('[data-ogsb] .mj-dark-2')

      chai.expect($('td.mj-dark-1').get().length).to.equal(1)
      chai.expect($('div.mj-dark-2').get().length).to.equal(1)
    })

    it('should accumulate rules from multiple mj-text components into one style block', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text dark-color="#ffffff">First</mj-text>
        <mj-text dark-color="#cccccc">Second</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const styles = headStyles(html)

      chai.expect(styles).to.include('.mj-dark-1 { color: #ffffff !important; }')
      chai.expect(styles).to.include('.mj-dark-2 { color: #cccccc !important; }')
      chai.expect(styles).to.not.include('[data-ogsb] .mj-dark-')

      // Only one media block covering both rules
      chai
        .expect(styles.split('@media (prefers-color-scheme: dark)').length - 1)
        .to.equal(1)
    })

    it('should combine selectors that share the same declaration', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text dark-color="#ffffff">First</mj-text>
        <mj-text dark-color="#ffffff">Second</mj-text>
        <mj-text dark-color="#ffffff">Third</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

      const { html } = await mjml(input)
      const styles = headStyles(html)

      chai.expect(styles).to.match(
        /\.mj-dark-1,\s*\.mj-dark-2,\s*\.mj-dark-3 \{ color: #ffffff !important; \}/,
      )
      chai.expect(styles.match(/color: #ffffff !important;/g)).to.have.length(1)
    })
  })
})
