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

describe('mj-section dark-background-color / dark-border-*-color', () => {
  it('should not emit dark-mode styles when no dark attributes are set', async () => {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml2html(input)
    chai.expect(html).not.to.contain('mj-dark-')
    chai.expect(html).not.to.contain('prefers-color-scheme')
  })

  it('should emit a background-color dark-mode rule for dark-background-color', async () => {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section dark-background-color="#111111">
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml2html(input)
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.contain('prefers-color-scheme: dark')
    chai.expect(styles).to.contain('background-color: #111111')

    const backgroundClassMatch = styles.match(
      /\.(mj-dark-\d+) \{ background-color: #111111 !important; \}/,
    )
    chai.expect(backgroundClassMatch).to.not.equal(null)

    const backgroundClassName = backgroundClassMatch[1]

    // Background class should target the section table (which owns background style), not wrapper div.
    chai.expect($(`div.${backgroundClassName}`).length).to.equal(0)
    chai.expect($(`table.${backgroundClassName}`).length).to.equal(1)
  })

  it('should apply dark-border-color to all sides when no specific side colors are set', async () => {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section dark-border-color="#ff00ff">
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml2html(input)
    const styles = headStyles(html)

    // Should emit only one general border-color rule.
    chai.expect(styles).to.contain('border-color: #ff00ff !important;')
    chai.expect(styles).to.not.contain('border-top-color: #ff00ff !important;')
    chai.expect(styles).to.not.contain('border-bottom-color: #ff00ff !important;')
    chai.expect(styles).to.not.contain('border-left-color: #ff00ff !important;')
    chai.expect(styles).to.not.contain('border-right-color: #ff00ff !important;')
  })

  it('should allow specific border-*-color to override dark-border-color', async () => {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section dark-border-color="#ff00ff" dark-border-top-color="#00ff00">
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml2html(input)
    const styles = headStyles(html)

    chai.expect(styles).to.contain('border-color: #ff00ff !important;')
    chai.expect(styles).to.contain('border-top-color: #00ff00 !important;')
    chai.expect(styles).to.not.contain('border-bottom-color: #ff00ff !important;')
    chai.expect(styles).to.not.contain('border-left-color: #ff00ff !important;')
    chai.expect(styles).to.not.contain('border-right-color: #ff00ff !important;')
  })

  it('should group same-color side overrides under one class', async () => {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section
            dark-border-color="orange"
            dark-border-top-color="green"
            dark-border-right-color="yellow"
            dark-border-left-color="pink"
            dark-border-bottom-color="pink"
          >
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml2html(input)
    const styles = headStyles(html)

    chai.expect(styles).to.contain('border-color: orange !important;')
    chai.expect(styles).to.contain('border-top-color: green !important;')
    chai.expect(styles).to.contain('border-right-color: yellow !important;')
    chai.expect(styles).to.contain('border-left-color: pink !important;')
    chai.expect(styles).to.contain('border-bottom-color: pink !important;')

    const borderColorClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: orange !important;[^}]*\}/,
    )
    const borderTopClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-top-color: green !important;[^}]*\}/,
    )
    const borderRightClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-right-color: yellow !important;[^}]*\}/,
    )
    const borderLeftClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-left-color: pink !important;[^}]*\}/,
    )
    const borderBottomClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-bottom-color: pink !important;[^}]*\}/,
    )

    chai.expect(borderColorClass).to.not.equal(null)
    chai.expect(borderTopClass).to.not.equal(null)
    chai.expect(borderRightClass).to.not.equal(null)
    chai.expect(borderLeftClass).to.not.equal(null)
    chai.expect(borderBottomClass).to.not.equal(null)

    chai.expect(borderTopClass[1]).to.equal(borderColorClass[1])
    chai.expect(borderRightClass[1]).to.equal(borderColorClass[1])
    chai.expect(borderLeftClass[1]).to.equal(borderColorClass[1])
    chai.expect(borderBottomClass[1]).to.equal(borderColorClass[1])
  })


  it('should apply border dark class to the section content td (not the table)', async () => {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section dark-border-top-color="#ff0000">
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml2html(input)
    const styles = headStyles(html)
    const $ = load(html)

    const borderClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-top-color: #ff0000 !important;[^}]*\}/,
    )

    chai.expect(borderClassMatch).to.not.equal(null)

    const borderClassName = borderClassMatch[1]

    chai.expect($(`td.${borderClassName}`).length).to.equal(1)
    chai.expect($(`table.${borderClassName}`).length).to.equal(0)
  })

  it('should handle both background and border dark colors together', async () => {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section
            dark-background-color="#1a1a1a"
            dark-border-color="#444444"
          >
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml2html(input)
    const styles = headStyles(html)

    chai.expect(styles).to.contain('background-color: #1a1a1a !important;')
    chai.expect(styles).to.contain('border-color: #444444 !important;')
    chai.expect(styles).to.not.contain('border-top-color: #444444 !important;')
    chai.expect(styles).to.not.contain('border-bottom-color: #444444 !important;')
    chai.expect(styles).to.not.contain('border-left-color: #444444 !important;')
    chai.expect(styles).to.not.contain('border-right-color: #444444 !important;')
  })

  it('should register separate classes for background and border dark rules', async () => {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section
            dark-background-color="#111111"
            dark-border-color="#444444"
          >
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml2html(input)
    const styles = headStyles(html)
    const backgroundClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )
    const borderClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #444444 !important;[^}]*\}/,
    )

    chai.expect(backgroundClassMatch).to.not.equal(null)
    chai.expect(borderClassMatch).to.not.equal(null)
    chai.expect(backgroundClassMatch[1]).to.not.equal(borderClassMatch[1])
  })

  it('should emit a single prefers-color-scheme block when multiple sections register dark rules', async () => {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section dark-background-color="#111111">
            <mj-column>
              <mj-text>One</mj-text>
            </mj-column>
          </mj-section>
          <mj-section dark-border-color="#444444">
            <mj-column>
              <mj-text>Two</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml2html(input)
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.contain('background-color: #111111 !important;')
    chai.expect(styles).to.contain('border-color: #444444 !important;')
  })
})
