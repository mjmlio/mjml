const chai = require('chai')
const { load } = require('cheerio')
const { sortBy } = require('lodash')
const mjml = require('../lib')

describe('html-attributes', function () {
  it('should put the attributes at the right place', async function () {
    const input = `
<mjml>
  <mj-head>
    <mj-html-attributes>
      <mj-selector path=".text div">
        <mj-html-attribute name="data-id">42</mj-html-attribute>
      </mj-selector>
      <mj-selector path=".image td">
        <mj-html-attribute name="data-name">43</mj-html-attribute>
      </mj-selector>
    </mj-html-attributes>
  </mj-head>
  <mj-body>
    <mj-raw>{ if item < 5 }</mj-raw>
    <mj-section css-class="section">
      <mj-column>
        <mj-raw>{ if item > 10 }</mj-raw>
        <mj-text css-class="text">
          Hello World! { item }
        </mj-text>
        <mj-raw>{ end if }</mj-raw>
        <mj-text css-class="text">
          Hello World! { item + 1 }
        </mj-text>
        <mj-image css-class="image" src="https://via.placeholder.com/150x30"/>
      </mj-column>
    </mj-section>
    <mj-raw>{ end if }</mj-raw>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)

    // should put the attributes at the right place
    chai
      .expect(
        $('.text div')
          .map(function getAttr() {
            return $(this).attr('data-id')
          })
          .get(),
        'Custom attributes added on texts',
      )
      .to.eql(['42', '42'])

    chai
      .expect(
        $('.image td')
          .map(function getAttr() {
            return $(this).attr('data-name')
          })
          .get(),
        'Custom attributes added on image',
      )
      .to.eql(['43'])

    // should not alter templating syntax, or move the content that is outside any tag (mj-raws)
    const expected = [
      '{ if item < 5 }',
      'class="section"',
      '{ if item > 10 }',
      'class="text"',
      '{ item }',
      '{ end if }',
      '{ item + 1 }',
    ]
    const indexes = expected.map((str) => html.indexOf(str))

    chai.expect(indexes, 'Templating syntax unaltered').to.not.include(-1)

    chai
      .expect(sortBy(indexes), 'Mj-raws kept same positions')
      .to.deep.eql(indexes)
  })

  // https://github.com/mjmlio/mjml/issues/3112
  describe('void elements', function () {
    // The path matches nothing in the body on purpose: the bug was triggered
    // by the mere presence of an mj-selector, wherever it points.
    const head = `
  <mj-head>
    <mj-html-attributes>
      <mj-selector path=".unrelated div">
        <mj-html-attribute name="data-id">42</mj-html-attribute>
      </mj-selector>
    </mj-html-attributes>
  </mj-head>`

    const template = (withSelector, text) => `
<mjml>${withSelector ? head : ''}
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text css-class="custom">${text}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const bodies = {
      'inside a <p>': `
          <p>
            Hello World!<br>
          </p>
        `,
      'outside any <p>': `
          Hello World!<br>
        `,
      'followed by another element': `
          <p>Hello<br><span>World!</span></p>
        `,
    }

    Object.entries(bodies).forEach(([position, text]) => {
      it(`emits the same <br> with and without an mj-selector, ${position}`, async function () {
        const [without, withSelector] = await Promise.all([
          mjml(template(false, text)),
          mjml(template(true, text)),
        ])

        const brs = (html) => html.match(/<br[^>]*>|<\/br\s*>/g) || []

        chai
          .expect(brs(withSelector.html), 'No closing tag on <br>')
          .to.deep.equal(['<br>'])

        chai
          .expect(brs(withSelector.html), 'Same <br> as without a selector')
          .to.deep.equal(brs(without.html))
      })
    })

    it('does not add a closing tag to images', async function () {
      const text = `
          <p>Hello<br><img src="https://via.placeholder.com/150x30" /></p>
        `
      const { html } = await mjml(template(true, text))

      chai.expect(html, 'No closing tag on <img>').to.not.include('</img>')
      chai
        .expect(html, 'Image src left untouched')
        .to.include('src="https://via.placeholder.com/150x30"')
    })
  })
})
