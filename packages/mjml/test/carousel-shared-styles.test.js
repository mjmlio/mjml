const chai = require('chai')
const mjml = require('../lib')

describe('mj-carousel shared styles', function () {
  it('should emit shared styles when an empty carousel precedes a populated one', async function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-carousel />
            <mj-carousel>
              <mj-carousel-image src="https://placehold.co/450x300/333/ccc/png" />
            </mj-carousel>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = await mjml(input)

    chai.expect(html).to.include('.mj-carousel-radio,')
  })
})