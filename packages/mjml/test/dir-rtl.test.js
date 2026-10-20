const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

const template = (dir, textAttrs = '') => `
  <mjml${dir ? ` dir="${dir}"` : ''}>
    <mj-body>
      <mj-section css-class="s">
        <mj-column css-class="c">
          <mj-text css-class="t"${textAttrs}><ul><li>item</li></ul></mj-text>
          <mj-table css-class="tbl"><tr><td>x</td></tr></mj-table>
          <mj-social>
            <mj-social-element name="facebook" href="#" css-class="se">Facebook</mj-social-element>
          </mj-social>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`

const render = async (input) => load((await mjml(input)).html)
const style = ($, selector, prop) =>
  extractStyle($(selector).attr('style'), prop)

describe('<mjml dir="rtl">', function () {
  it('mirrors direction and alignment defaults', async function () {
    const $ = await render(template('rtl'))

    chai
      .expect($('.s td').first().attr('style'))
      .not.to.contain('direction:ltr')
    chai.expect($('.c').attr('style')).not.to.contain('direction:ltr')
    chai.expect(style($, '.c', 'text-align')).to.equal('right')
    chai.expect(style($, '.t > div', 'text-align')).to.equal('right')
    chai.expect($('.tbl').attr('align')).to.equal('right')
  })

  it('mirrors column gutters', async function () {
    const { html } = await mjml(`
      <mjml dir="rtl"><mj-body><mj-section gutter="20px">
        <mj-column><mj-text>A</mj-text></mj-column>
        <mj-column><mj-text>B</mj-text></mj-column>
      </mj-section></mj-body></mjml>`)

    chai.expect(html).to.contain('mj-column-gutter-2-1-per-3-333333-rtl')
  })

  it('mirrors group gutters inside an rtl section', async function () {
    const { html } = await mjml(`
      <mjml><mj-body><mj-section direction="rtl" gutter="20px"><mj-group>
        <mj-column><mj-text>A</mj-text></mj-column>
        <mj-column><mj-text>B</mj-text></mj-column>
      </mj-group></mj-section></mj-body></mjml>`)

    chai.expect(html).to.contain('mj-column-gutter-2-1-per-3-333333-rtl')
  })

  it('keeps attributes the author set explicitly', async function () {
    const $ = await render(template('rtl', ' align="center"'))

    chai.expect(style($, '.t > div', 'text-align')).to.equal('center')
  })

  it('leaves ltr and auto output unchanged', async function () {
    const html = async (dir) =>
      (await mjml(template(dir))).html.replace(/dir="[a-z]+"/g, '')

    chai.expect(await html('ltr')).to.equal(await html(undefined))
    chai
      .expect(style(await render(template()), '.t > div', 'text-align'))
      .to.equal('left')
  })
})
