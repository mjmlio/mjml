const chai = require('chai')
const { load } = require('cheerio')
const mirrorAttributes = require('mjml-core/lib/helpers/mirrorAttributes')
const { BodyComponent, components, registerComponent } = require('mjml-core')
const { dependencies } = require('mjml-validator')
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

const gutterCss = (html, className) => {
  const match = new RegExp(`\\.${className} \\{ padding: ([^;!]+)`).exec(html)
  return match && match[1].trim()
}

describe('<mjml dir="rtl">', function () {
  it('sets the document direction', async function () {
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
    const html = async (dir) => (await mjml(template(dir))).html
    const none = await html(undefined)

    expect(await html('auto')).to.equal(none)
    // only <html> and the body <div> carry the document dir
    expect(
      (await html('ltr'))
        .replace('dir="ltr"', 'dir="auto"')
        .replace('dir="ltr"', 'dir="auto"'),
    ).to.equal(none)
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

    // and the same for the responsive gutter
    const responsive = await mjml(
      body(
        'dir="rtl"',
        column(`<mj-social gutter--responsive="20px">
          <mj-social-element name="x" href="#" css-class="first">X</mj-social-element>
          <mj-social-element name="facebook" href="#" css-class="last">F</mj-social-element>
        </mj-social>`),
      ),
    )
    const r$ = load(responsive.html)
    const rule = (selector) => {
      const className = r$(selector)
        .find('td')
        .first()
        .attr('class')
        .split(' ')
        .find((c) => c.startsWith('mj-responsive-'))
      return new RegExp(`\\.${className} \\{ padding: ([^;!]+)`)
        .exec(responsive.html)[1]
        .trim()
    }
    expect(rule('tr.first')).to.equal('20px 0 20px 20px')
    expect(rule('tr.last')).to.equal('20px 20px 20px 0')

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
        'left-icon': 'l.png',
        'right-icon': 'r.png',
      }),
    ).to.deep.equal({
      align: 'right',
      'text-align': 'left',
      direction: 'rtl',
      padding: '1px 4px 3px 2px',
      'text-padding': '1px 2px',
      'icon-position': 'left',
      'vertical-align': 'top',
      'left-icon': 'l.png',
      'right-icon': 'r.png',
    })
  })

  it('leaves centred values alone', function () {
    expect(mirrorAttributes({ align: 'center' })).to.deep.equal({
      align: 'center',
    })
  })

  it('swaps the values of left and right attributes', function () {
    expect(
      mirrorAttributes({
        'padding-left': '10px',
        'inner-padding-left': '1px',
        'inner-padding-right': '2px',
        'border-right': '1px solid red',
      }),
    ).to.deep.equal({
      'padding-right': '10px',
      'inner-padding-right': '1px',
      'inner-padding-left': '2px',
      'border-left': '1px solid red',
    })
  })

  it('keeps calc() as one padding value', function () {
    expect(
      mirrorAttributes({
        padding: '0 0 0 calc(10px + (2 * 5px))',
        'inner-padding': '0 calc(10px + 5px)',
      }),
    ).to.deep.equal({
      padding: '0 calc(10px + (2 * 5px)) 0 0',
      'inner-padding': '0 calc(10px + 5px)',
    })
  })
})

describe('rtl defaults on a custom component', function () {
  class MjDummyBox extends BodyComponent {
    render() {
      return `<div ${this.htmlAttributes({
        class: 'box',
        'data-align': this.getAttribute('align'),
        'data-padding': this.getAttribute('padding'),
        'data-padding-left': this.getAttribute('padding-left'),
        'data-padding-right': this.getAttribute('padding-right'),
      })}></div>`
    }
  }
  MjDummyBox.componentName = 'mj-dummy-box'
  MjDummyBox.allowedAttributes = {
    align: 'enum(left,right,center)',
    padding: 'unit(px,%){1,4}',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
  }
  MjDummyBox.defaultAttributes = {
    align: 'left',
    padding: '0 0 0 4px',
    'padding-left': '10px',
  }
  MjDummyBox.dependencies = {
    'mj-column': ['mj-dummy-box'],
    'mj-dummy-box': [],
  }

  let columnDependencies

  before(function () {
    columnDependencies = dependencies['mj-column']
    registerComponent(MjDummyBox, { registerDependencies: true })
  })

  after(function () {
    delete components['mj-dummy-box']
    delete dependencies['mj-dummy-box']
    dependencies['mj-column'] = columnDependencies
  })

  it('mirrors its defaults like a built-in one', async function () {
    const { html } = await mjml(body('dir="rtl"', column('<mj-dummy-box />')))
    expect(load(html)('.box').data()).to.deep.equal({
      align: 'right',
      padding: '0 4px 0 0',
      paddingRight: '10px',
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
  const accordion = (attrs) => `<mj-accordion ${attrs}>
      <mj-accordion-element>
        <mj-accordion-title>t</mj-accordion-title>
        <mj-accordion-text>b</mj-accordion-text>
      </mj-accordion-element>
    </mj-accordion>`

  const tableComponents = {
    'mj-button': (attrs) => `<mj-button ${attrs} href="#">b</mj-button>`,
    'mj-social': (attrs) =>
      `<mj-social ${attrs}><mj-social-element name="x" href="#">X</mj-social-element></mj-social>`,
    'mj-social vertical': (attrs) =>
      `<mj-social mode="vertical" ${attrs}><mj-social-element name="x" href="#">X</mj-social-element></mj-social>`,
    'mj-table': (attrs) => `<mj-table ${attrs}><tr><td>c</td></tr></mj-table>`,
    'mj-table scroll': (attrs) =>
      `<mj-table layout--responsive="scroll" ${attrs}><tr><td>c</td></tr></mj-table>`,
  }

  const selectorFor = (name) =>
    name === 'mj-table scroll' ? 'td.x .mj-scroll-table-inner table' : 'td.x table'

  Object.entries(tableComponents).forEach(([name, markup]) => {
    it(`puts direction on the table of ${name}`, async function () {
      const { html, errors } = await mjml(
        body('', column(markup('direction="rtl" css-class="x"'))),
      )
      const $ = load(html)
      const selector = selectorFor(name)

      expect(errors).to.deep.equal([])
      expect($(selector).first().attr('dir')).to.equal('rtl')
      expect(extractStyle($(selector).first().attr('style'), 'direction')).to.equal(
        'rtl',
      )
      // Horizontal mj-social has only inline tables, and their order comes from
      // the direction around them.
      const wrapper = name.startsWith('mj-social') ? 'rtl' : undefined
      expect($('td.x').attr('dir')).to.equal(wrapper)
      expect(style($, 'td.x', 'direction')).to.equal(wrapper)
    })

    it(`carries the document direction on the table of ${name}`, async function () {
      const $ = await render(body('dir="rtl"', column(markup('css-class="x"'))))

      expect($(selectorFor(name)).first().attr('dir')).to.equal('rtl')
    })

    it(`keeps CSS direction but not dir on ${name} without Outlook classic`, async function () {
      const $ = await render(
        body(
          'support-outlook-classic="false"',
          column(markup('direction="rtl" css-class="x"')),
        ),
      )
      const table = $(selectorFor(name)).first()

      expect(table.attr('dir')).to.equal(undefined)
      expect(extractStyle(table.attr('style'), 'direction')).to.equal('rtl')
    })
  })

  // Outlook classic shows no alt text, the only text these render, so they
  // get CSS direction but no dir.
  const cssOnlyComponents = {
    'mj-image': {
      markup: (attrs) => `<mj-image ${attrs} src="a.png" alt="a" />`,
      element: 'td.x table',
    },
    'mj-carousel': {
      markup: (attrs) => `<mj-carousel ${attrs}>
          <mj-carousel-image src="a.png" alt="a" />
          <mj-carousel-image src="b.png" alt="b" />
        </mj-carousel>`,
      // the wrapper, which holds the thumbnails as well as the main table
      element: 'div.mj-carousel',
    },
  }

  Object.entries(cssOnlyComponents).forEach(([name, { markup, element }]) => {
    it(`sets CSS direction, but not dir, on ${name}`, async function () {
      const { html, errors } = await mjml(
        body('', column(markup('direction="rtl" css-class="x"'))),
      )
      const $ = load(html)

      expect(errors).to.deep.equal([])
      expect(style($, element, 'direction')).to.equal('rtl')
      expect($(element).attr('dir')).to.equal(undefined)
      expect($('td.x').attr('dir')).to.equal(undefined)
    })

    it(`adds no dir to ${name} in an rtl document`, async function () {
      const $ = await render(body('dir="rtl"', column(markup('css-class="x"'))))

      expect($(element).attr('dir')).to.equal(undefined)
    })
  })

  it('shows each carousel icon on its own side', async function () {
    const carousel = (mjmlAttrs, attrs = '') =>
      body(
        mjmlAttrs,
        column(`<mj-carousel ${attrs}>
          <mj-carousel-image src="a.png" />
          <mj-carousel-image src="b.png" />
        </mj-carousel>`),
      )
    const icons = ($) => ({
      previous: $('img[alt="previous"]').first().attr('src'),
      next: $('img[alt="next"]').first().attr('src'),
    })
    const ltr = icons(await render(carousel('')))
    // rtl puts previous on the right, which shows the right-hand icon
    const swapped = { previous: ltr.next, next: ltr.previous }

    expect(icons(await render(carousel('dir="rtl"')))).to.deep.equal(swapped)
    expect(icons(await render(carousel('', 'direction="rtl"')))).to.deep.equal(
      swapped,
    )
    expect(
      icons(await render(carousel('dir="rtl"', 'left-icon="l.png" right-icon="r.png"'))),
    ).to.deep.equal({ previous: 'r.png', next: 'l.png' })
    expect(
      icons(await render(carousel('dir="rtl"', 'left-icon="l.png"'))),
    ).to.deep.equal({ previous: ltr.next, next: 'l.png' })

    const dark = await render(
      carousel('dir="rtl"', 'left-icon--dark="ld.png" right-icon--dark="rd.png"'),
    )
    expect(
      dark('img[alt="previous"]').first().parent().find('source').attr('srcset'),
    ).to.equal('rd.png')
  })

  it('applies to the wrapper of mj-text, which has no table', async function () {
    const { html, errors } = await mjml(
      body('', column('<mj-text direction="rtl" css-class="x">t</mj-text>')),
    )
    const $ = load(html)

    expect(errors).to.deep.equal([])
    expect($('td.x').attr('dir')).to.equal('rtl')
    expect(style($, 'td.x', 'direction')).to.equal('rtl')
  })

  it('carries direction on the Outlook table of a fixed-height mj-text', async function () {
    const { html } = await mjml(
      body('dir="rtl"', column('<mj-text height="50px">t</mj-text>')),
    )

    expect(html).to.contain('cellspacing="0" dir="rtl"><tr><td height="50px"')
  })

  it('applies to the wrapper and ghost table of mj-navbar', async function () {
    const { html, errors } = await mjml(
      body(
        '',
        column(
          '<mj-navbar direction="rtl" css-class="x"><mj-navbar-link href="#">l</mj-navbar-link></mj-navbar>',
        ),
      ),
    )
    const $ = load(html)

    expect(errors).to.deep.equal([])
    expect($('td.x').attr('dir')).to.equal('rtl')
    expect(style($, 'td.x', 'direction')).to.equal('rtl')
    expect(html).to.contain('align="center" dir="rtl">')
  })

  it('carries direction on the ghost table of a horizontal mj-social', async function () {
    const { html } = await mjml(
      body(
        'dir="rtl"',
        column(
          '<mj-social><mj-social-element name="x" href="#">X</mj-social-element></mj-social>',
        ),
      ),
    )

    expect(html).to.match(/<!--\[if mso[^\]]*\]>\s*<table[^>]*align="center"[^>]*dir="rtl"/)
  })

  it('carries direction on the table of each mj-social-element', async function () {
    for (const mode of ['horizontal', 'vertical']) {
      // eslint-disable-next-line no-await-in-loop
      const $ = await render(
        body(
          'dir="rtl"',
          column(`<mj-social mode="${mode}" css-class="x">
            <mj-social-element name="x" href="#">X</mj-social-element>
            <mj-social-element name="facebook" href="#">F</mj-social-element>
          </mj-social>`),
        ),
      )
      const dirs = $('td.x table')
        .map((_, el) => $(el).attr('dir'))
        .get()

      // horizontal: an inline table and an element table per element;
      // vertical: the social table and an element table per element
      expect(dirs.length).to.equal(mode === 'horizontal' ? 4 : 3)
      expect(dirs.every((dir) => dir === 'rtl')).to.equal(true)
    }
  })

  it('applies to the title and text tables of mj-accordion', async function () {
    const { html, errors } = await mjml(
      body('', column(accordion('direction="rtl" css-class="x"'))),
    )
    const $ = load(html)

    expect(errors).to.deep.equal([])
    expect($('.mj-accordion-title table').attr('dir')).to.equal('rtl')
    expect($('.mj-accordion-content table').attr('dir')).to.equal('rtl')
    expect(style($, '.mj-accordion', 'direction')).to.equal('rtl')
    expect($('td.x').attr('dir')).to.equal(undefined)
  })

  it('carries the document direction on mj-accordion tables', async function () {
    const $ = await render(body('dir="rtl"', column(accordion(''))))

    expect($('.mj-accordion-title table').attr('dir')).to.equal('rtl')
    expect($('.mj-accordion-content table').attr('dir')).to.equal('rtl')
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
    const rtl = await render(body('', column(accordion('direction="rtl"'))))
    expect(style(rtl, '.mj-accordion', 'text-align')).to.equal('right')

    const ltr = await render(body('dir="rtl"', column(accordion('direction="ltr"'))))
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
  const children = `
    <mj-text css-class="t">x</mj-text>
    <mj-text css-class="kept" align="center">x</mj-text>
    <mj-table css-class="tbl"><tr><td>c</td></tr></mj-table>
    <mj-button css-class="b" href="#">b</mj-button>`

  it('overrides an rtl document for its children', async function () {
    const $ = await render(body('dir="rtl"', column(children, 'direction="ltr"')))

    expect(style($, '.t > div', 'text-align')).to.equal('left')
    expect($('.t').attr('align')).to.equal('left')
    expect($('.tbl').attr('align')).to.equal('left')
    expect($('.tbl table').attr('dir')).to.equal('ltr')
    expect($('.b table').attr('dir')).to.equal('ltr')
    expect(style($, '.kept > div', 'text-align')).to.equal('center')
  })

  it('mirrors its children without an rtl document', async function () {
    const $ = await render(body('', column(children, 'direction="rtl"')))

    expect(style($, '.c', 'direction')).to.equal('rtl')
    expect(style($, '.c', 'text-align')).to.equal('right')
    expect(style($, '.t > div', 'text-align')).to.equal('right')
    expect($('.t').attr('align')).to.equal('right')
    expect($('.tbl').attr('align')).to.equal('right')
    expect($('.tbl table').attr('dir')).to.equal('rtl')
    expect($('.b table').attr('dir')).to.equal('rtl')
    expect(style($, '.kept > div', 'text-align')).to.equal('center')
  })

  it('stops at the column', async function () {
    const $ = await render(`
      <mjml><mj-body><mj-section>
        <mj-column direction="rtl"><mj-text css-class="r">r</mj-text></mj-column>
        <mj-column><mj-text css-class="l">l</mj-text></mj-column>
      </mj-section></mj-body></mjml>`)

    expect(style($, '.r > div', 'text-align')).to.equal('right')
    expect(style($, '.l > div', 'text-align')).to.equal('left')
  })
})

describe('direction--responsive on a column', function () {
  it('stays CSS-only, so the mobile direction still applies', async function () {
    const $ = await render(
      body(
        '',
        column(
          '<mj-text css-class="t">A</mj-text><mj-button css-class="b" href="#">b</mj-button>',
          'direction="rtl" direction--responsive="ltr"',
        ),
      ),
    )

    expect($('.c table').first().attr('dir')).to.equal(undefined)
    expect($('.b table').attr('dir')).to.equal(undefined)
    expect($('.t').attr('align')).to.equal('left')
    expect(style($, '.c', 'text-align')).to.equal('left')
    expect(style($, '.c', 'direction')).to.equal('rtl')
  })
})

describe('direction on a section', function () {
  it('orders columns without changing text direction or alignment', async function () {
    const $ = await render(`
      <mjml><mj-body><mj-section direction="rtl">
        <mj-column css-class="c"><mj-text css-class="t">x</mj-text></mj-column>
      </mj-section></mj-body></mjml>`)

    expect(style($, '.t > div', 'text-align')).to.equal('left')
    expect(style($, '.c', 'text-align')).to.equal('left')
    expect(style($, '.c', 'direction')).to.equal('ltr')
    expect($('.c table').attr('dir')).to.equal(undefined)
  })

  it('leaves column text in the document direction', async function () {
    const columns = (mjmlAttrs) => `
      <mjml ${mjmlAttrs}><mj-body><mj-section direction="rtl">
        <mj-column css-class="c"><mj-text>x</mj-text></mj-column>
        <mj-column css-class="d" direction="rtl"><mj-text>y</mj-text></mj-column>
      </mj-section></mj-body></mjml>`

    for (const [attrs, expected] of [
      ['', 'ltr'],
      ['dir="auto"', 'ltr'],
      ['dir="ltr"', 'ltr'],
      ['dir="rtl"', 'rtl'],
    ]) {
      // eslint-disable-next-line no-await-in-loop
      const $ = await render(columns(attrs))
      expect(style($, '.c', 'direction')).to.equal(expected)
      expect(style($, '.d', 'direction')).to.equal('rtl')
    }
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

  it('mirrors its children without an rtl document', async function () {
    const $ = await render(hero('', 'direction="rtl"'))

    expect(style($, '.t > div', 'text-align')).to.equal('right')
    expect($('.t').attr('align')).to.equal('right')
  })

  it('keeps a child that sets its own align', async function () {
    const $ = await render(hero('', 'direction="rtl"', 'align="center"'))

    expect(style($, '.t > div', 'text-align')).to.equal('center')
  })

  it('passes a child direction to its wrapper', async function () {
    const $ = await render(hero('', '', 'direction="rtl"'))

    expect($('.t').attr('dir')).to.equal('rtl')
    expect(style($, '.t', 'direction')).to.equal('rtl')
  })
})
