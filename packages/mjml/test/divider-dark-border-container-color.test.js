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

function wrapDivider(attrs = '') {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-divider ${attrs} />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-divider dark-border-color / dark-container-background-color', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(
      wrapDivider('container-background-color="#ffffff" border-color="#000000"'),
    )

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should emit a border-top-color dark-mode rule for dark-border-color', async function () {
    const { html } = await mjml(
      wrapDivider('border-color="#000000" dark-border-color="#ff0000"'),
    )
    const styles = headStyles(html)

    chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
    chai
      .expect(styles)
      .to.include('.mj-dark-1 { border-top-color: #ff0000 !important; }')
    chai
      .expect(styles)
      .to.not.include('[data-ogsb] .mj-dark-1 { border-top-color: #ff0000 !important; }')
  })

  it('should apply dark-border-color class to the divider table, not the wrapper <td>', async function () {
    const { html } = await mjml(
      wrapDivider('dark-border-color="#ff0000"'),
    )
    const $ = load(html)

    chai.expect($('table.mj-dark-1').get().length).to.equal(1)
    chai.expect($('td.mj-dark-1').get().length).to.equal(0)
  })

  it('should apply dark-container-background-color class to the wrapper <td>', async function () {
    const { html } = await mjml(
      wrapDivider('dark-container-background-color="#111111"'),
    )
    const $ = load(html)

    chai.expect($('td.mj-dark-1').get().length).to.equal(1)
    chai.expect($('table.mj-dark-1').get().length).to.equal(0)
  })

  it('should preserve css-class while merging dark-container-background-color class', async function () {
    const { html } = await mjml(
      wrapDivider('css-class="my-divider" dark-container-background-color="#111111"'),
    )
    const $ = load(html)

    chai.expect($('td.my-divider').attr('class')).to.equal('my-divider mj-dark-1')
  })

  it('should register separate classes for container and border dark rules', async function () {
    const { html } = await mjml(
      wrapDivider('dark-container-background-color="#111111" dark-border-color="#ff0000"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    chai
      .expect(styles)
      .to.include('.mj-dark-1 { background-color: #111111 !important; }')
    chai
      .expect(styles)
      .to.include('.mj-dark-2 { border-top-color: #ff0000 !important; }')

    chai.expect($('td.mj-dark-1').get().length).to.equal(1)
    chai.expect($('table.mj-dark-2').get().length).to.equal(1)
  })

  it('should emit a single prefers-color-scheme block when multiple dividers have dark rules', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-divider dark-container-background-color="#111111" />
        <mj-divider dark-border-color="#ff0000" />
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
    chai.expect(styles).to.include('border-top-color: #ff0000 !important;')
  })
})
