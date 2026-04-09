const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

describe('mj-carousel-image dark sources', function () {
  it('renders picture wrappers for main images and thumbnails', async function () {
    const lightSrc = 'https://example.com/carousel-light.png'
    const darkSrc = 'https://example.com/carousel-dark.png'
    const lightThumbnailSrc = 'https://example.com/carousel-thumb-light.png'
    const darkThumbnailSrc = 'https://example.com/carousel-thumb-dark.png'

    const input = `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image
            src="${lightSrc}"
            dark-src="${darkSrc}"
            thumbnails-src="${lightThumbnailSrc}"
            dark-thumbnails-src="${darkThumbnailSrc}"
          />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)

    chai
      .expect(
        $('.mj-carousel-image picture source')
          .map(function mapSource() {
            return $(this).attr('srcset')
          })
          .get(),
      )
      .to.include(darkSrc)

    chai
      .expect(
        $('.mj-carousel-thumbnail picture source')
          .map(function mapSource() {
            return $(this).attr('srcset')
          })
          .get(),
      )
      .to.include(darkThumbnailSrc)

    chai.expect($('.mj-carousel-image img').first().attr('src')).to.equal(lightSrc)
    chai
      .expect($('.mj-carousel-thumbnail img').first().attr('src'))
      .to.equal(lightThumbnailSrc)

    chai.expect(html).to.not.include('mj-dark-image-bg')
  })

  it('falls back to dark-src for thumbnails when dark-thumbnails-src is omitted', async function () {
    const lightSrc = 'https://example.com/carousel-light-fallback.png'
    const darkSrc = 'https://example.com/carousel-dark-fallback.png'

    const input = `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image src="${lightSrc}" dark-src="${darkSrc}" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)

    chai
      .expect(
        $('.mj-carousel-thumbnail picture source')
          .map(function mapSource() {
            return $(this).attr('srcset')
          })
          .get(),
      )
      .to.include(darkSrc)
  })

  it('renders dark sources for left and right carousel control icons', async function () {
    const lightLeftIcon = 'https://example.com/carousel-left-light.png'
    const darkLeftIcon = 'https://example.com/carousel-left-dark.png'
    const lightRightIcon = 'https://example.com/carousel-right-light.png'
    const darkRightIcon = 'https://example.com/carousel-right-dark.png'

    const input = `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel
          left-icon="${lightLeftIcon}"
          dark-left-icon="${darkLeftIcon}"
          right-icon="${lightRightIcon}"
          dark-right-icon="${darkRightIcon}"
        >
          <mj-carousel-image src="https://example.com/carousel-light.png" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)

    chai
      .expect(
        $('.mj-carousel-previous-icons picture source')
          .map(function mapSource() {
            return $(this).attr('srcset')
          })
          .get(),
      )
      .to.include(darkLeftIcon)

    chai
      .expect(
        $('.mj-carousel-next-icons picture source')
          .map(function mapSource() {
            return $(this).attr('srcset')
          })
          .get(),
      )
      .to.include(darkRightIcon)

    chai.expect($('.mj-carousel-previous-icons img').first().attr('src')).to.equal(lightLeftIcon)
    chai.expect($('.mj-carousel-next-icons img').first().attr('src')).to.equal(lightRightIcon)
  })
})