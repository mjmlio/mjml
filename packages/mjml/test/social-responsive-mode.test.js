const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

function allHeadStyles(html) {
  const $ = load(html)
  return $('head style')
    .map(function () {
      return $(this).text()
    })
    .get()
    .join('\n')
}

function wrapSocial(attrs, elements) {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social mode="horizontal" ${attrs}>
          ${elements}
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

const ELEMENTS = `
  <mj-social-element name="facebook" href="https://mjml.io/">Facebook</mj-social-element>
  <mj-social-element name="twitter" href="https://mjml.io/">Twitter</mj-social-element>
`

describe('mj-social responsive-mode="stack"', function () {
  it('adds mj-social-stack class to each inline-table wrapper', async function () {
    const { html } = await mjml(wrapSocial('responsive-mode="stack"', ELEMENTS))
    const $ = load(html)
    chai.expect($('table.mj-social-stack').length).to.equal(2)
  })

  it('does not add mj-social-stack class when responsive-mode is not set', async function () {
    const { html } = await mjml(wrapSocial('', ELEMENTS))
    chai.expect(html).to.not.include('mj-social-stack')
  })

  it('emits the stack @media CSS block in the head', async function () {
    const { html } = await mjml(wrapSocial('responsive-mode="stack"', ELEMENTS))
    const styles = allHeadStyles(html)
    chai.expect(styles).to.include('.mj-social-stack')
    chai.expect(styles).to.include('display: table !important')
    chai.expect(styles).to.include('float: none !important')
    chai.expect(styles).to.include('@media only screen and (max-width:479px)')
  })

  it('does not emit the stack style block when responsive-mode is not set', async function () {
    const { html } = await mjml(wrapSocial('', ELEMENTS))
    const styles = allHeadStyles(html)
    chai.expect(styles).to.not.include('.mj-social-stack')
  })

  it('emits the stack style block only once when multiple stack social components are present', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social mode="horizontal" responsive-mode="stack">
          ${ELEMENTS}
        </mj-social>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-social mode="horizontal" responsive-mode="stack">
          ${ELEMENTS}
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
    const { html } = await mjml(input)
    const styles = allHeadStyles(html)
    const occurrences = (styles.match(/\.mj-social-stack\s*\{/g) || []).length
    chai.expect(occurrences).to.equal(1)
  })
})
