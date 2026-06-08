const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

// Each mj-social-element in these tests carries this css-class, which MJML
// renders onto the element's <tr>. Scoping the border selector to that row
// guarantees we only inspect social icon images, never an unrelated <img>
// elsewhere in the document.
const SOCIAL_ICON_CLASS = 'mj-social-border-test'

const renderSocial = ({ mode = 'horizontal', socialBorder, elements }) => {
  const socialBorderAttr = socialBorder ? ` border="${socialBorder}"` : ''
  const children = elements
    .map(({ name, border }) => {
      const borderAttr = border ? ` border="${border}"` : ''
      return `<mj-social-element css-class="${SOCIAL_ICON_CLASS}" name="${name}" href="https://mjml.io/"${borderAttr} />`
    })
    .join('\n              ')

  return mjml(
    `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-social mode="${mode}"${socialBorderAttr}>
              ${children}
              </mj-social>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `,
    { minify: false },
  )
}

const collectSocialBorders = (html) => {
  const $ = load(html)
  return $(`tr.${SOCIAL_ICON_CLASS} img`)
    .map(function getBorder() {
      const style = $(this).attr('style') || ''
      return extractStyle(style, 'border')
    })
    .get()
}

describe('mj-social-element border attribute', function () {
  it('renders the default border:0 on each social-element <img>', async function () {
    const { html } = await renderSocial({
      elements: [{ name: 'facebook' }, { name: 'twitter' }],
    })
    const borders = collectSocialBorders(html)

    chai.expect(borders).to.have.lengthOf(2)
    borders.forEach((b) => chai.expect(b).to.equal('0'))
  })

  it('honors an explicit border on a single mj-social-element', async function () {
    const { html } = await renderSocial({
      elements: [
        { name: 'facebook', border: '2px solid red' },
        { name: 'twitter' },
      ],
    })
    const borders = collectSocialBorders(html)

    chai.expect(borders).to.deep.equal(['2px solid red', '0'])
  })

  it('cascades a border set on mj-social to every child element', async function () {
    const { html } = await renderSocial({
      socialBorder: '1px solid #ccc',
      elements: [
        { name: 'facebook' },
        { name: 'twitter' },
        { name: 'linkedin' },
      ],
    })
    const borders = collectSocialBorders(html)

    chai.expect(borders).to.have.lengthOf(3)
    borders.forEach((b) => chai.expect(b).to.equal('1px solid #ccc'))
  })

  it('lets the element-level border override a cascaded border from mj-social', async function () {
    const { html } = await renderSocial({
      socialBorder: '1px solid #ccc',
      elements: [
        { name: 'facebook', border: '3px dashed #000' },
        { name: 'twitter' },
      ],
    })
    const borders = collectSocialBorders(html)

    chai.expect(borders).to.deep.equal(['3px dashed #000', '1px solid #ccc'])
  })

  it('applies cascade and element override in vertical mode (different markup)', async function () {
    // mj-social compiles a separate layout for mode="vertical", so the border
    // cascade and element-level override are exercised independently here.
    const { html } = await renderSocial({
      mode: 'vertical',
      socialBorder: '1px solid #ccc',
      elements: [
        { name: 'facebook' },
        { name: 'twitter', border: '2px solid red' },
      ],
    })
    const borders = collectSocialBorders(html)

    chai.expect(borders).to.deep.equal(['1px solid #ccc', '2px solid red'])
  })
})
