const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

const render = async (template) => mjml(template, { minify: false })

const collectImgBorders = (html) => {
  const $ = load(html)
  return $('img')
    .map(function getBorder() {
      const style = $(this).attr('style') || ''
      return extractStyle(style, 'border')
    })
    .get()
}

describe('mj-social-element border attribute', function () {
  it('renders the default border:0 on each social-element <img>', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-social>
                <mj-social-element name="facebook" href="https://mjml.io/" />
                <mj-social-element name="twitter" href="https://mjml.io/" />
              </mj-social>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await render(input)
    const borders = collectImgBorders(html)

    chai.expect(borders).to.have.lengthOf(2)
    borders.forEach((b) => chai.expect(b).to.equal('0'))
  })

  it('honors an explicit border on a single mj-social-element', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-social>
                <mj-social-element name="facebook" href="https://mjml.io/" border="2px solid red" />
                <mj-social-element name="twitter" href="https://mjml.io/" />
              </mj-social>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await render(input)
    const borders = collectImgBorders(html)

    chai.expect(borders).to.deep.equal(['2px solid red', '0'])
  })

  it('cascades a border set on mj-social to every child element', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-social border="1px solid #ccc">
                <mj-social-element name="facebook" href="https://mjml.io/" />
                <mj-social-element name="twitter" href="https://mjml.io/" />
                <mj-social-element name="linkedin" href="https://mjml.io/" />
              </mj-social>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await render(input)
    const borders = collectImgBorders(html)

    chai.expect(borders).to.have.lengthOf(3)
    borders.forEach((b) => chai.expect(b).to.equal('1px solid #ccc'))
  })

  it('lets the element-level border override a cascaded border from mj-social', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-social border="1px solid #ccc">
                <mj-social-element name="facebook" href="https://mjml.io/" border="3px dashed #000" />
                <mj-social-element name="twitter" href="https://mjml.io/" />
              </mj-social>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await render(input)
    const borders = collectImgBorders(html)

    chai.expect(borders).to.deep.equal(['3px dashed #000', '1px solid #ccc'])
  })
})
