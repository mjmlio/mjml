const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

function renderNavbar(attrs = '') {
  return mjml(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-navbar ${attrs}>
          <mj-navbar-link href="https://mjml.io/">Link</mj-navbar-link>
        </mj-navbar>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`)
}

describe('mj-navbar layout--responsive="stack"', function () {
  it('adds a stack class and mobile link rule', async function () {
    const { html } = await renderNavbar('layout--responsive="stack"')
    const $ = load(html)
    chai.expect($('.mj-inline-links-1').length).to.equal(1)
    chai
      .expect($('head style').text())
      .to.include('.mj-inline-links-1 .mj-link { display: block !important }')
  })

  it('does not add stack styles when the modifier is absent', async function () {
    const { html } = await renderNavbar()
    chai.expect(html).to.not.include('mj-inline-links-1')
  })

  it('rejects the old responsive-mode attribute', async function () {
    const { errors } = await renderNavbar('responsive-mode="stack"')
    chai
      .expect(errors.map((error) => error.message))
      .to.include('Attribute responsive-mode is illegal')
  })

  it('does not stack hamburger navbars', async function () {
    const { html } = await renderNavbar(
      'hamburger="hamburger" layout--responsive="stack"',
    )
    const $ = load(html)
    chai.expect($('.mj-inline-links-1').length).to.equal(0)
    chai
      .expect($('head style').text())
      .to.not.include('.mj-inline-links-1 .mj-link')
  })
})
