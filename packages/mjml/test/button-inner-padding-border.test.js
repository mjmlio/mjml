const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

async function renderButtonStyle(attributes = '') {
  const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-button ${attributes}>Test</mj-button>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `

  const { html } = await mjml(input)
  const $ = load(html)

  return $('a, p').first().attr('style')
}

describe('mj-button inner-padding border compensation', function () {
  it('should compensate the default inner-padding for the Outlook content border', async function () {
    const style = await renderButtonStyle()

    chai.expect(extractStyle(style, 'padding')).to.equal('9px 24px')
    chai.expect(extractStyle(style, 'border')).to.equal('1px solid #414141')
  })

  it('should compensate user-provided inner-padding for the Outlook content border', async function () {
    const style = await renderButtonStyle('inner-padding="20px 30px" background-color="#123456"')

    chai.expect(extractStyle(style, 'padding')).to.equal('19px 29px')
    chai.expect(extractStyle(style, 'border')).to.equal('1px solid #123456')
  })

  it('should clamp compensated padding values at zero', async function () {
    const style = await renderButtonStyle('inner-padding="0px 1px 2px 3px"')

    chai.expect(extractStyle(style, 'padding')).to.equal('0px 0px 1px 2px')
    chai.expect(extractStyle(style, 'border')).to.equal('1px solid #414141')
  })
})