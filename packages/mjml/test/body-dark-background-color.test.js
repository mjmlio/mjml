const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

// Helper: collect text content of all <style> blocks inside <head>
function headStyles(html) {
  const $ = load(html)
  return $('head style')
    .map(function () {
      return $(this).text()
    })
    .get()
    .join('\n')
}

describe('mj-body dark-background-color', function () {
  it('should not emit dark-mode color-scheme head style when no dark-background-color is set', async function () {
    const input = `
<mjml>
  <mj-body background-color="#ffffff">
    <mj-section>
      <mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should emit a prefers-color-scheme dark style when dark-background-color is set', async function () {
    const input = `
<mjml>
  <mj-body background-color="#ffffff" dark-background-color="#000000">
    <mj-section>
      <mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const styles = headStyles(html)

    chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
    chai.expect(styles).to.include('.mj-dark-1')
    chai.expect(styles).to.include('background-color: #000000')
  })

  it('should emit a single prefers-color-scheme block when body and child dark rules are present', async function () {
    const input = `
<mjml>
  <mj-body dark-background-color="#101010">
    <mj-section>
      <mj-column>
        <mj-button dark-color="#00ff00" dark-background-color="#222222">Click</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.include('background-color: #101010')
    chai.expect(styles).to.include('color: #00ff00')
    chai.expect(styles).to.include('background-color: #222222')
  })

  it('should not emit a [data-ogsb] Outlook rule by default', async function () {
    const input = `
<mjml>
  <mj-body background-color="#ffffff" dark-background-color="#000000">
    <mj-section>
      <mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const styles = headStyles(html)

    chai
      .expect(styles)
      .to.not.include('[data-ogsb] .mj-dark-1 { background-color: #000000 !important; }')
  })

  it('should apply the mj-dark-N class to the body wrapper div', async function () {
    const input = `
<mjml>
  <mj-body background-color="#ffffff" dark-background-color="#000000">
    <mj-section>
      <mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)

    const body = $('body')
    const wrapperDiv = $('body > div[role="article"]')
    chai.expect(body.attr('class')).to.include('mj-dark-1')
    chai.expect(wrapperDiv.get().length).to.equal(1)
    chai.expect(wrapperDiv.attr('class')).to.include('mj-dark-1')
  })

  it('should preserve a user-defined body css-class when adding the dark class', async function () {
    const input = `
<mjml>
  <mj-body css-class="user-body-class" dark-background-color="#000000">
    <mj-section>
      <mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)

    chai.expect($('body').attr('class')).to.equal('user-body-class mj-dark-1')
    chai.expect($('body > div[role="article"]').attr('class')).to.equal('mj-dark-1')
  })

  it('should use a sequential class counter and include !important on rules', async function () {
    const input = `
<mjml>
  <mj-body dark-background-color="#111111">
    <mj-section>
      <mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const styles = headStyles(html)

    chai
      .expect(styles)
      .to.include('.mj-dark-1 { background-color: #111111 !important; }')
    chai
      .expect(styles)
      .to.not.include('[data-ogsb] .mj-dark-1 { background-color: #111111 !important; }')

    const $ = load(html)
    const wrapperDiv = $('body > div[role="article"]')
    chai.expect(wrapperDiv.attr('class')).to.equal('mj-dark-1')
  })
})
