const chai = require('chai')
const { load } = require('cheerio')
const mirrorAttributes = require('mjml-core/lib/helpers/mirrorAttributes')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

const { expect } = chai

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

const body = (mjmlAttrs, content) => `
  <mjml ${mjmlAttrs}><mj-body><mj-section>${content}</mj-section></mj-body></mjml>
`
const column = (content, attrs = '') =>
  `<mj-column css-class="c" ${attrs}>${content}</mj-column>`

const render = async (input) => load((await mjml(input)).html)
const style = ($, selector, prop) =>
  extractStyle($(selector).attr('style'), prop)

const gutterCss = (html, className) =>
  new RegExp(`\\.${className} \\{ padding: ([^;!]+)`).exec(html)[1].trim()

describe('<mjml dir="rtl">', function () {
  it('sets the document direction that reverses the column order', async function () {
    const $ = await render(template('rtl'))

    expect($('html').attr('dir')).to.equal('rtl')
    expect($('body > div').attr('dir')).to.equal('rtl')
  })

  it('mirrors alignment defaults', async function () {
    const $ = await render(template('rtl'))

    expect(style($, '.c', 'text-align')).to.equal('right')
    expect(style($, '.t > div', 'text-align')).to.equal('right')
    expect($('.t').attr('align')).to.equal('right')
    expect($('.tbl').attr('align')).to.equal('right')
  })

  it('puts column gutters between the mirrored columns', async function () {
    const { html } = await mjml(`
      <mjml dir="rtl"><mj-body><mj-section gutter="20px">
        <mj-column><mj-text>A</mj-text></mj-column>
        <mj-column><mj-text>B</mj-text></mj-column>
      </mj-section></mj-body></mjml>`)

    // The first column sits on the right: no padding on its outer (right)
    // edge, half the gutter towards the second column on its left.
    expect(gutterCss(html, 'mj-column-gutter-2-1-per-3-333333-rtl')).to.equal(
      '0% 0% 0% 1.666667%',
    )
    expect(gutterCss(html, 'mj-column-gutter-2-2-per-3-333333-rtl')).to.equal(
      '0% 1.666667% 0% 0%',
    )
    expect(html).to.contain('padding:0px 0px 0px 10px;')
    expect(html).to.contain('padding:0px 10px 0px 0px;')
  })

  it('mirrors group gutters inside an rtl section', async function () {
    const { html } = await mjml(`
      <mjml><mj-body><mj-section direction="rtl" gutter="20px"><mj-group>
        <mj-column><mj-text>A</mj-text></mj-column>
        <mj-column><mj-text>B</mj-text></mj-column>
      </mj-group></mj-section></mj-body></mjml>`)

    const $ = load(html)

    // Group columns carry their gutter inline, since they don't stack.
    expect(
      style($, '.mj-column-gutter-2-1-per-3-333333-rtl', 'padding'),
    ).to.equal('0% 0% 0% 1.666667%')
    expect(
      style($, '.mj-column-gutter-2-2-per-3-333333-rtl', 'padding'),
    ).to.equal('0% 1.666667% 0% 0%')
  })

  it('keeps attributes the author set explicitly', async function () {
    const $ = await render(template('rtl', ' align="center"'))

    expect(style($, '.t > div', 'text-align')).to.equal('center')
  })

  it('leaves ltr and auto output unchanged', async function () {
    const html = async (dir) =>
      (await mjml(template(dir))).html.replace(/dir="[a-z]+"/g, '')

    expect(await html('ltr')).to.equal(await html(undefined))
    expect(style(await render(template()), '.t > div', 'text-align')).to.equal(
      'left',
    )
  })

  it('mirrors social spacing and gutters', async function () {
    const social = (attrs) =>
      body(
        'dir="rtl"',
        column(`<mj-social>
          <mj-social-element name="x" href="#" ${attrs} css-class="se">X</mj-social-element>
          <mj-social-element name="facebook" href="#" ${attrs}>F</mj-social-element>
        </mj-social>`),
      )

    const { html } = await mjml(social(''))
    expect(html).to.contain('padding-right:10px')
    expect(html).to.not.contain('padding-left:10px')
    // The first element sits on the right, so its right edge is the flush one.
    expect(html).to.contain('padding:10px 0 10px 10px;')
    expect(html).to.contain('padding:10px 10px 10px 0;')

    // A trailing icon is on the left, with the text to its right.
    const trailing = await mjml(social('icon-position="right"'))
    expect(trailing.html).to.contain('padding-left:10px')
    expect(trailing.html).to.not.contain('padding-right:10px')
  })
})

describe('mirrorAttributes', function () {
  it('swaps physical sides only', function () {
    expect(
      mirrorAttributes({
        align: 'left',
        'text-align': 'right',
        direction: 'ltr',
        padding: '1px 2px 3px 4px',
        'text-padding': '1px 2px',
        'icon-position': 'left',
        'vertical-align': 'top',
      }),
    ).to.deep.equal({
      align: 'right',
      'text-align': 'left',
      direction: 'rtl',
      padding: '1px 4px 3px 2px',
      'text-padding': '1px 2px',
      'icon-position': 'left',
      'vertical-align': 'top',
    })
  })

  it('leaves centred values alone', function () {
    expect(mirrorAttributes({ align: 'center' })).to.deep.equal({
      align: 'center',
    })
  })
})

describe('Outlook classic direction on column tables', function () {
  const tableDirs = ($) =>
    $('.c table')
      .map((_, table) => $(table).attr('dir'))
      .get()

  const textColumn = (attrs = '') =>
    column('<mj-text>x</mj-text>', `padding="10px" ${attrs}`)

  it('sets dir on every table of a column in an rtl document', async function () {
    const $ = await render(body('dir="rtl"', textColumn()))

    expect($('.c table').length).to.equal(2)
    expect(tableDirs($)).to.deep.equal(['rtl', 'rtl'])
  })

  it('lets the direction of a column take precedence', async function () {
    const $ = await render(body('dir="rtl"', textColumn('direction="ltr"')))

    expect(tableDirs($)).to.deep.equal(['ltr', 'ltr'])
    expect(style($, '.c', 'text-align')).to.equal('left')
  })

  it('carries an explicit column direction without an rtl document', async function () {
    const $ = await render(body('', textColumn('direction="rtl"')))

    expect(tableDirs($)).to.deep.equal(['rtl', 'rtl'])
  })

  it('adds nothing without an explicit direction', async function () {
    for (const attrs of ['', 'dir="ltr"', 'dir="auto"']) {
      // eslint-disable-next-line no-await-in-loop
      const $ = await render(body(attrs, textColumn()))
      expect(tableDirs($)).to.deep.equal([])
    }
  })

  it('is omitted with support-outlook-classic="false"', async function () {
    const $ = await render(
      body('dir="rtl" support-outlook-classic="false"', textColumn()),
    )

    expect(tableDirs($)).to.deep.equal([])
    expect($('html').attr('dir')).to.equal('rtl')
  })
})

describe('direction on a component', function () {
  const components = {
    'mj-accordion': `<mj-accordion direction="rtl" css-class="x">
        <mj-accordion-element>
          <mj-accordion-title>t</mj-accordion-title>
          <mj-accordion-text>b</mj-accordion-text>
        </mj-accordion-element>
      </mj-accordion>`,
    'mj-button': '<mj-button direction="rtl" css-class="x" href="#">b</mj-button>',
    'mj-navbar':
      '<mj-navbar direction="rtl" css-class="x"><mj-navbar-link href="#">l</mj-navbar-link></mj-navbar>',
    'mj-social':
      '<mj-social direction="rtl" css-class="x"><mj-social-element name="x" href="#">X</mj-social-element></mj-social>',
    'mj-table':
      '<mj-table direction="rtl" css-class="x"><tr><td>c</td></tr></mj-table>',
    'mj-text': '<mj-text direction="rtl" css-class="x">t</mj-text>',
  }

  Object.entries(components).forEach(([name, markup]) => {
    it(`applies to ${name} in an ltr document, without validation errors`, async function () {
      const { html, errors } = await mjml(body('', column(markup)))
      const $ = load(html)

      expect(errors).to.deep.equal([])
      expect($('td.x').attr('dir')).to.equal('rtl')
      expect(style($, 'td.x', 'direction')).to.equal('rtl')
    })
  })

  it('mirrors the default alignment of the component only', async function () {
    const $ = await render(
      body(
        '',
        column(`
          <mj-text direction="rtl" css-class="r">r</mj-text>
          <mj-table direction="rtl" css-class="tbl"><tr><td>c</td></tr></mj-table>
          <mj-text css-class="l">l</mj-text>`),
      ),
    )

    expect(style($, '.r > div', 'text-align')).to.equal('right')
    expect($('.tbl').attr('align')).to.equal('right')
    expect(style($, '.l > div', 'text-align')).to.equal('left')
    expect($('.l').attr('dir')).to.equal(undefined)
  })

  it('keeps an explicit align', async function () {
    const $ = await render(
      body('', column('<mj-text direction="rtl" align="center" css-class="t">x</mj-text>')),
    )

    expect(style($, '.t > div', 'text-align')).to.equal('center')
  })

  it('overrides an rtl document', async function () {
    const $ = await render(
      body('dir="rtl"', column('<mj-text direction="ltr" css-class="t">x</mj-text>')),
    )

    expect($('.t').attr('dir')).to.equal('ltr')
    expect(style($, '.t > div', 'text-align')).to.equal('left')
  })

  it('aligns an accordion, which has no align attribute', async function () {
    const accordion = (direction) => `<mj-accordion direction="${direction}">
        <mj-accordion-element>
          <mj-accordion-title>t</mj-accordion-title>
          <mj-accordion-text>b</mj-accordion-text>
        </mj-accordion-element>
      </mj-accordion>`

    const rtl = await render(body('', column(accordion('rtl'))))
    expect(style(rtl, '.mj-accordion', 'text-align')).to.equal('right')

    const ltr = await render(body('dir="rtl"', column(accordion('ltr'))))
    expect(style(ltr, '.mj-accordion', 'text-align')).to.equal('left')
  })

  it('flips social spacing from mj-social', async function () {
    const { html } = await mjml(
      body(
        '',
        column(
          '<mj-social direction="rtl"><mj-social-element name="x" href="#">X</mj-social-element></mj-social>',
        ),
      ),
    )

    expect(html).to.contain('padding-right:10px')
  })
})

describe('direction on a column', function () {
  it('reaches its children in an rtl document', async function () {
    const $ = await render(
      body('dir="rtl"', column('<mj-text css-class="t">x</mj-text>', 'direction="ltr"')),
    )

    expect(style($, '.t > div', 'text-align')).to.equal('left')
    expect($('.t').attr('align')).to.equal('left')
  })

  it('leaves child alignment alone outside an rtl document', async function () {
    const $ = await render(
      body('', column('<mj-text css-class="t">x</mj-text>', 'direction="rtl"')),
    )

    expect(style($, '.t > div', 'text-align')).to.equal('left')
    expect(style($, '.c', 'text-align')).to.equal('left')
  })
})

describe('direction on mj-hero', function () {
  const hero = (mjmlAttrs, heroAttrs, text = '') => `
    <mjml ${mjmlAttrs}><mj-body>
      <mj-hero ${heroAttrs}><mj-text css-class="t" ${text}>x</mj-text></mj-hero>
    </mj-body></mjml>`

  it('sets the direction of its content', async function () {
    const { html, errors } = await mjml(hero('', 'direction="rtl"'))
    const $ = load(html)

    expect(errors).to.deep.equal([])
    expect(style($, '.mj-hero-content', 'direction')).to.equal('rtl')
    expect($('.mj-hero-content table table').attr('dir')).to.equal('rtl')
  })

  it('carries an rtl document for Outlook classic', async function () {
    const $ = await render(hero('dir="rtl"', ''))

    expect($('.mj-hero-content table table').attr('dir')).to.equal('rtl')
    expect(style($, '.t > div', 'text-align')).to.equal('right')
  })

  it('overrides an rtl document, for its children too', async function () {
    const $ = await render(hero('dir="rtl"', 'direction="ltr"'))

    expect(style($, '.mj-hero-content', 'direction')).to.equal('ltr')
    expect(style($, '.t > div', 'text-align')).to.equal('left')
  })

  it('passes a child direction to its wrapper', async function () {
    const $ = await render(hero('', '', 'direction="rtl"'))

    expect($('.t').attr('dir')).to.equal('rtl')
    expect(style($, '.t', 'direction')).to.equal('rtl')
  })
})
