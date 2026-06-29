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

function wrapGroup(attrs = '', children = '') {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-group ${attrs}>
        ${children || '<mj-column><mj-text>Hello</mj-text></mj-column>'}
      </mj-group>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-group dark-background-color', function () {
  it('should not emit dark-mode styles when no dark-background-color is set', async function () {
    const { html } = await mjml(wrapGroup('background-color="#ffffff"'))

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should emit a prefers-color-scheme dark style when dark-background-color is set', async function () {
    const { html } = await mjml(
      wrapGroup('background-color="#ffffff" dark-background-color="#000000"'),
    )
    const styles = headStyles(html)

    chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
    chai.expect(styles).to.include('.mj-dark-1')
    chai.expect(styles).to.include('background-color: #000000')
  })

  it('should not emit a [data-ogsb] Outlook rule by default', async function () {
    const { html } = await mjml(
      wrapGroup('background-color="#ffffff" dark-background-color="#000000"'),
    )
    const styles = headStyles(html)

    chai
      .expect(styles)
      .to.not.include('[data-ogsb] .mj-dark-1 { background-color: #000000 !important; }')
  })

  it('should apply the mj-dark-N class to the group div', async function () {
    const { html } = await mjml(
      wrapGroup('background-color="#ffffff" dark-background-color="#000000"'),
    )
    const $ = load(html)

    chai.expect($('div.mj-dark-1').get().length).to.be.at.least(1)
  })

  it('should preserve an existing css-class when adding the dark class', async function () {
    const { html } = await mjml(
      wrapGroup(
        'css-class="my-group" background-color="#ffffff" dark-background-color="#000000"',
      ),
    )
    const $ = load(html)

    const groupDiv = $('div.my-group')
    chai.expect(groupDiv.get().length).to.be.at.least(1)
    chai.expect(groupDiv.attr('class')).to.include('my-group')
    chai.expect(groupDiv.attr('class')).to.include('mj-dark-1')
  })

  it('should accumulate rules from multiple mj-group components into one style block', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-group dark-background-color="#111111">
        <mj-column><mj-text>First</mj-text></mj-column>
      </mj-group>
      <mj-group dark-background-color="#222222">
        <mj-column><mj-text>Second</mj-text></mj-column>
      </mj-group>
    </mj-section>
  </mj-body>
</mjml>
`
    const { html } = await mjml(input)
    const styles = headStyles(html)

    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g)
    chai.expect(mediaMatches).to.have.length(1)
    chai.expect(styles).to.include('mj-dark-1')
    chai.expect(styles).to.include('#111111')
    chai.expect(styles).to.include('mj-dark-2')
    chai.expect(styles).to.include('#222222')
  })
})
