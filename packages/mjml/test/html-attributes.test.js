const chai = require('chai')
const cheerio = require('cheerio')
const { sortBy } = require('lodash')
const mjml = require('../lib')

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

const { html } = mjml(input)
const $ = cheerio.load(html)

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

chai.expect(sortBy(indexes), 'Mj-raws kept same positions').to.deep.eql(indexes)
