const chai = require('chai')
const mjml = require('../lib')

const render = (paddingAttrs) =>
  mjml(`
    <mjml>
      <mj-body>
        <mj-hero
          mode="fixed-height"
          height="200px"
          background-width="600px"
          background-height="200px"
          ${paddingAttrs}>
          <mj-text>hero content</mj-text>
        </mj-hero>
      </mj-body>
    </mjml>
  `)

// mj-hero emits two Outlook conditional tables: the outer wrapper
// (align="center" ... role="presentation", always the full container width)
// and the inner content table whose width is containerWidth − horizontalPadding.
// Asserting on the inner table specifically avoids false positives where the
// outer table happens to share the expected width (e.g. zero horizontal padding).
const innerOutlookTable = (expected) =>
  `<table border="0" cellpadding="0" cellspacing="0" style="width:${expected}px;" width="${expected}" >`

describe('mj-hero inner container width', function () {
  const cases = [
    { padding: 'padding="0"', expected: 600 },
    { padding: 'padding="0 20px"', expected: 560 },
    { padding: 'padding="0 10px 0 30px"', expected: 560 },
    { padding: 'padding="20px"', expected: 560 },
    { padding: 'padding="0 50px 0 50px"', expected: 500 },
  ]

  cases.forEach(function ({ padding, expected }) {
    it(`reduces the inner outlook table width by horizontal padding (${padding})`, async function () {
      const { html } = await render(padding)

      chai.expect(html).to.include(innerOutlookTable(expected))
    })
  })

  it('uses explicit padding-left/padding-right with no shorthand', async function () {
    const { html } = await render('padding-left="30px" padding-right="10px"')

    chai.expect(html).to.include(innerOutlookTable(560))
  })

  it('prioritises padding-left/padding-right over the shorthand', async function () {
    // getShorthandAttrValue resolves the directional attributes ahead of the
    // shorthand, so left=30 + right=10 wins over the shorthand's 20+20.
    const { html } = await render(
      'padding="20px" padding-left="30px" padding-right="10px"',
    )

    chai.expect(html).to.include(innerOutlookTable(560))
  })

  it('produces a negative width when horizontal padding exceeds the container', async function () {
    // 600 − (400 + 400) = −200. Pinning the current behaviour so any future
    // clamping becomes a deliberate, visible change rather than a silent regression.
    const { html } = await render('padding="0 400px"')

    chai.expect(html).to.include(innerOutlookTable(-200))
  })
})
