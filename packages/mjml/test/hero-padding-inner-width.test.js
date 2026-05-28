const chai = require('chai')
const mjml = require('../lib')

describe('mj-hero inner container width', function () {
  const cases = [
    { padding: '0', expected: 600 },
    { padding: '0 20px', expected: 560 },
    { padding: '0 10px 0 30px', expected: 560 },
    { padding: '20px', expected: 560 },
    { padding: '0 50px 0 50px', expected: 500 },
  ]

  cases.forEach(function ({ padding, expected }) {
    it(`reduces the inner outlook table width by horizontal padding (padding="${padding}")`, async function () {
      const input = `
        <mjml>
          <mj-body>
            <mj-hero
              mode="fixed-height"
              height="200px"
              background-width="600px"
              background-height="200px"
              padding="${padding}">
              <mj-text>hero content</mj-text>
            </mj-hero>
          </mj-body>
        </mjml>
      `

      const { html } = await mjml(input)

      chai
        .expect(html)
        .to.include(`style="width:${expected}px;" width="${expected}"`)
    })
  })
})
