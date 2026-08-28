const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

describe('mj-navbar icon overrides', function () {
  it('should preserve icon font overrides from mj-navbar attributes', async function () {
    const input = `
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-navbar ico-font-family="Test Family" ico-font-size="19px" ico-line-height="21px" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-navbar hamburger="hamburger">
              <mj-navbar-link href="#">Link</mj-navbar-link>
            </mj-navbar>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = await mjml(input)
    const $ = load(html)
    const style = $('.mj-menu-label').attr('style')

    chai.expect(extractStyle(style, 'font-family')).to.equal('Test Family')
    chai.expect(extractStyle(style, 'font-size')).to.equal('19px')
    chai.expect(extractStyle(style, 'line-height')).to.equal('21px')
  })

  it('should preserve icon font overrides from mj-class', async function () {
    const input = `
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-class name="nav-icons" ico-font-family="Class Family" ico-font-size="17px" ico-line-height="23px" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-navbar mj-class="nav-icons" hamburger="hamburger">
              <mj-navbar-link href="#">Link</mj-navbar-link>
            </mj-navbar>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = await mjml(input)
    const $ = load(html)
    const style = $('.mj-menu-label').attr('style')

    chai.expect(extractStyle(style, 'font-family')).to.equal('Class Family')
    chai.expect(extractStyle(style, 'font-size')).to.equal('17px')
    chai.expect(extractStyle(style, 'line-height')).to.equal('23px')
  })
})