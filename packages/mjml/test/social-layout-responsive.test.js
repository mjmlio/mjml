const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

function allHeadStyles(html) {
  const $ = load(html)
  return $('head style')
    .map(function () {
      return $(this).text()
    })
    .get()
    .join('\n')
}

function wrapSocial(attrs, elements) {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social mode="horizontal" ${attrs}>
          ${elements}
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

const ELEMENTS = `
  <mj-social-element name="facebook" href="https://mjml.io/">Facebook</mj-social-element>
  <mj-social-element name="twitter" href="https://mjml.io/">Twitter</mj-social-element>
`

describe('mj-social gutters', function () {
  const elements = `
    <mj-social-element name="facebook" css-class="first">Facebook</mj-social-element>
    <mj-social-element name="x" css-class="middle">X</mj-social-element>
    <mj-social-element name="twitter" css-class="last">Twitter</mj-social-element>
  `

  for (const mode of ['horizontal', 'vertical']) {
    for (const direction of ['ltr', 'rtl']) {
      it(`splits desktop and responsive gaps in ${direction} ${mode} mode`, async function () {
        const { html, errors } = await mjml(
          wrapSocial('gutter="40px" gutter--responsive="20px"', elements)
            .replace('mode="horizontal"', `mode="${mode}"`)
            .replace('<mjml>', `<mjml dir="${direction}">`),
        )
        const $ = load(html)
        const styles = allHeadStyles(html)
        let edges = ['0 20px 20px 20px', '20px 20px 0 20px']
        if (mode === 'horizontal') {
          edges = direction === 'rtl'
            ? ['20px 0 20px 20px', '20px 20px 20px 0']
            : ['20px 20px 20px 0', '20px 0 20px 20px']
        }

        chai.expect(errors).to.deep.equal([])
        for (const [index, name] of ['first', 'last'].entries()) {
          const cell = $(`tr.${name} > td`).first()
          chai.expect(cell.attr('style')).to.include(`padding:${edges[index]};`)
          const responsivePadding = edges[index].replace(/20px/g, '10px')
          chai.expect(styles).to.include(
            `.${cell.attr('class')} { padding: ${responsivePadding} !important; }`,
          )
        }
        chai.expect($('tr.middle > td').attr('style')).to.include('padding:20px;')
        chai.expect(styles).to.include(
          `.${$('tr.middle > td').attr('class')} { padding: 10px !important; }`,
        )
      })
    }
  }

  it('preserves fractional halves and padding shorthand', async function () {
    const { html } = await mjml(wrapSocial('gutter="5px 9px 2.5px 0"', elements))
    const $ = load(html)

    chai.expect($('tr.middle > td').attr('style')).to.include('padding:2.5px 4.5px 1.25px 0px;')
  })
})

describe('mj-social layout--responsive="stack"', function () {
  it('adds mj-social-stack class to each inline-table wrapper', async function () {
    const { html } = await mjml(
      wrapSocial('layout--responsive="stack"', ELEMENTS),
    )
    const $ = load(html)
    chai.expect($('table.mj-social-stack').length).to.equal(2)
  })

  it('does not add mj-social-stack class when layout--responsive is not set', async function () {
    const { html } = await mjml(wrapSocial('', ELEMENTS))
    chai.expect(html).to.not.include('mj-social-stack')
  })

  it('emits the stack @media CSS block in the head', async function () {
    const { html } = await mjml(
      wrapSocial('layout--responsive="stack"', ELEMENTS),
    )
    const styles = allHeadStyles(html)
    chai.expect(styles).to.include('.mj-social-stack')
    chai.expect(styles).to.include('display: table !important')
    chai.expect(styles).to.include('float: none !important')
    chai.expect(styles).to.include('@media only screen and (max-width:479px)')
  })

  it('does not emit the stack style block when layout--responsive is not set', async function () {
    const { html } = await mjml(wrapSocial('', ELEMENTS))
    const styles = allHeadStyles(html)
    chai.expect(styles).to.not.include('.mj-social-stack')
  })

  it('rejects the old responsive-mode attribute', async function () {
    const { errors } = await mjml(
      wrapSocial('responsive-mode="stack"', ELEMENTS),
    )
    chai
      .expect(errors.map((error) => error.message))
      .to.include('Attribute responsive-mode is illegal')
  })

  it('leaves vertical mode unchanged with layout--responsive="stack"', async function () {
    const input = (attrs) =>
      wrapSocial(attrs, ELEMENTS).replace(
        'mode="horizontal"',
        'mode="vertical"',
      )
    const { html } = await mjml(input('layout--responsive="stack"'))
    const { html: baseline } = await mjml(input(''))
    chai.expect(html).to.equal(baseline)
    chai.expect(allHeadStyles(html)).to.not.include('.mj-social-stack')
  })

  it('emits the stack style block only once when multiple stack social components are present', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social mode="horizontal" layout--responsive="stack">
          ${ELEMENTS}
        </mj-social>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-social mode="horizontal" layout--responsive="stack">
          ${ELEMENTS}
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
    const { html } = await mjml(input)
    const styles = allHeadStyles(html)
    const occurrences = (styles.match(/\.mj-social-stack\s*\{/g) || []).length
    chai.expect(occurrences).to.equal(1)
  })
})
