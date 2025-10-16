const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-carousel-thumbnail thumbnails supported', function () {
  it('should render correct display in CSS style values on mj-carousel-thumbnail', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-carousel thumbnails="supported">
              <mj-carousel-image src="https://placehold.co/450x300/333/ccc/png" />
              <mj-carousel-image src="https://placehold.co/450x300/ccc/000/png" />
              <mj-carousel-image src="https://placehold.co/450x300/f45e43/fff/png" />
            </mj-carousel>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = mjml(input)

    const $ = load(html)

    // style values should be correct
    chai
      .expect(
        $('.mj-carousel-thumbnail')
          .map(function getAttr() {
            const start = $(this).attr('style').indexOf('display:') + 8
            const end = $(this).attr('style').indexOf(';', start)
            const result = $(this).attr('style').substring(start, end)
            return result
          })
          .get(),
        'Display CSS style values on mj-carousel-thumbnail',
      )
      .to.eql(['none', 'none', 'none'])
  })
})
