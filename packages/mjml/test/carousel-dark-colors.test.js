const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

function headStyles(html) {
  const $ = load(html)
  return $('head style')
    .map(function () {
      return $(this).text()
    })
    .get()
    .join('\n')
}

function wrapCarousel({ carouselAttrs = '', imageAttrs = '' } = {}) {
  return `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel
          css-class="car-root"
          thumbnails="visible"
          container-background-color="#f0f0f0"
          tb-border="3px solid #222222"
          tb-hover-border-color="#444444"
          tb-selected-border-color="#555555"
          ${carouselAttrs}
        >
          <mj-carousel-image
            src="https://example.com/light.png"
            thumbnails-src="https://example.com/thumb.png"
            ${imageAttrs}
          />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-carousel dark colors', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(wrapCarousel())

    chai.expect(html).to.not.include('prefers-color-scheme: dark')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should apply dark-container-background-color class to the carousel wrapper td and preserve css-class', async function () {
    const { html } = await mjml(
      wrapCarousel({
        carouselAttrs: 'dark-container-background-color="#111111"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const containerClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )

    chai.expect(containerClassMatch).to.not.equal(null)

    const darkClass = containerClassMatch[1]
    const wrapperClass = $('td.car-root').attr('class')

    chai.expect(wrapperClass).to.include('car-root')
    chai.expect(wrapperClass).to.include(darkClass)
    chai.expect($(`table.mj-carousel-main.${darkClass}`).length).to.equal(0)
  })

  it('should apply dark-tb-border-color class to the thumbnail anchor', async function () {
    const { html } = await mjml(
      wrapCarousel({
        carouselAttrs: 'dark-tb-border-color="#ababab"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const borderClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #ababab !important;[^}]*\}/,
    )

    chai.expect(borderClassMatch).to.not.equal(null)

    const darkClass = borderClassMatch[1]

    chai.expect($(`a.mj-carousel-thumbnail.${darkClass}`).length).to.equal(1)
    chai.expect($(`table.mj-carousel-main.${darkClass}`).length).to.equal(0)
    chai.expect($(`td.car-root.${darkClass}`).length).to.equal(0)
  })

  it('should let mj-carousel-image dark-tb-border-color override the inherited carousel value', async function () {
    const { html } = await mjml(
      wrapCarousel({
        carouselAttrs: 'dark-tb-border-color="#111111"',
        imageAttrs: 'dark-tb-border-color="#222222"',
      }),
    )
    const styles = headStyles(html)

    chai.expect(styles).to.include('border-color: #222222 !important;')
    chai.expect(styles).to.not.include('border-color: #111111 !important;')
  })

  it('should emit scoped dark hover and selected thumbnail border rules', async function () {
    const { html } = await mjml(
      wrapCarousel({
        carouselAttrs:
          'dark-tb-hover-border-color="#00ff00" dark-tb-selected-border-color="#ff00ff"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const thumbnailClasses = ($('a.mj-carousel-thumbnail').attr('class') || '').split(
      ' ',
    )
    const carouselThumbnailClass = thumbnailClasses.find((className) =>
      /^mj-carousel-[a-f0-9]+-thumbnail$/.test(className),
    )
    const selectedThumbnailClass = thumbnailClasses.find((className) =>
      /^mj-carousel-[a-f0-9]+-thumbnail-1$/.test(className),
    )

    chai.expect(carouselThumbnailClass).to.not.equal(undefined)
    chai.expect(selectedThumbnailClass).to.not.equal(undefined)
    chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
    chai.expect(styles).to.include(`${carouselThumbnailClass}:hover`)
    chai.expect(styles).to.include(selectedThumbnailClass)
    chai.expect(styles).to.include('border-color: #00ff00 !important;')
    chai.expect(styles).to.include('border-color: #ff00ff !important;')
    chai.expect(styles).to.not.include('.mj-carousel-thumbnail:hover {')
  })
})