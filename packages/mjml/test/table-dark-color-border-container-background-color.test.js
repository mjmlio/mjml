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

function wrapTable(attrs = '') {
  return `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table ${attrs}>
          <tr><td>Cell</td></tr>
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-table dark-color / dark-border-color / dark-container-background-color', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(
      wrapTable('color="#000000" border="1px solid #000000" container-background-color="#ffffff"'),
    )

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should emit a color dark-mode rule and apply its class to the inner table', async function () {
    const { html } = await mjml(
      wrapTable('css-class="my-table" color="#000000" dark-color="#ffffff"'),
    )

    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
    chai.expect(styles).to.include('color: #ffffff !important;')

    const colorClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*color: #ffffff !important;[^}]*\}/,
    )
    chai.expect(colorClassMatch).to.not.equal(null)

    const darkClass = colorClassMatch[1]

    chai.expect($(`td.my-table > table.${darkClass}`).length).to.equal(1)
    chai.expect($(`td.${darkClass}`).length).to.equal(0)
  })

  it('should emit a border-color dark-mode rule and apply its class to the inner table', async function () {
    const { html } = await mjml(
      wrapTable('css-class="my-table" border="2px solid #333333" dark-border-color="#ff0000"'),
    )

    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('border-color: #ff0000 !important;')

    const borderClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #ff0000 !important;[^}]*\}/,
    )
    chai.expect(borderClassMatch).to.not.equal(null)

    const darkClass = borderClassMatch[1]

    chai.expect($(`td.my-table > table.${darkClass}`).length).to.equal(1)
    chai.expect($(`td.${darkClass}`).length).to.equal(0)
  })

  it('should use a single dark class for dark-border-color and dark-color on table', async function () {
    const { html } = await mjml(
      wrapTable('css-class="my-table" dark-border-color="#ff0000" dark-color="#ffffff"'),
    )

    const styles = headStyles(html)
    const $ = load(html)

    const borderClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #ff0000 !important;[^}]*\}/,
    )
    const colorClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*color: #ffffff !important;[^}]*\}/,
    )

    chai.expect(borderClassMatch).to.not.equal(null)
    chai.expect(colorClassMatch).to.not.equal(null)
    chai.expect(borderClassMatch[1]).to.equal(colorClassMatch[1])

    chai.expect($('td.my-table > table').attr('class')).to.equal(borderClassMatch[1])
  })

  it('should apply dark-container-background-color class to wrapper td and preserve css-class', async function () {
    const { html } = await mjml(
      wrapTable('css-class="my-table" dark-container-background-color="#111111"'),
    )

    const styles = headStyles(html)
    const $ = load(html)

    const containerClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )

    chai.expect(containerClassMatch).to.not.equal(null)

    const darkClass = containerClassMatch[1]

    chai.expect($('td.my-table').attr('class')).to.equal(`my-table ${darkClass}`)
    chai.expect($(`td.${darkClass}`).length).to.equal(1)
    chai.expect($(`td.my-table > table.${darkClass}`).length).to.equal(0)
  })

  it('should use separate classes for wrapper background and table border/color', async function () {
    const { html } = await mjml(
      wrapTable('css-class="my-table" dark-border-color="#ff0000" dark-color="#ffffff" dark-container-background-color="#111111"'),
    )

    const styles = headStyles(html)
    const $ = load(html)

    const tableClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #ff0000 !important;[^}]*color: #ffffff !important;[^}]*\}/,
    )
    const containerClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )

    chai.expect(tableClassMatch).to.not.equal(null)
    chai.expect(containerClassMatch).to.not.equal(null)
    chai.expect(tableClassMatch[1]).to.not.equal(containerClassMatch[1])

    chai.expect($('td.my-table').attr('class')).to.equal(`my-table ${containerClassMatch[1]}`)
    chai.expect($('td.my-table > table').attr('class')).to.equal(tableClassMatch[1])
  })

  it('should emit a single prefers-color-scheme block when multiple tables register dark rules', async function () {
    const input = `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table dark-container-background-color="#111111">
          <tr><td>One</td></tr>
        </mj-table>
        <mj-table dark-border-color="#ff0000" dark-color="#ffffff">
          <tr><td>Two</td></tr>
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.include('background-color: #111111 !important;')
    chai.expect(styles).to.include('border-color: #ff0000 !important;')
    chai.expect(styles).to.include('color: #ffffff !important;')
  })
})
