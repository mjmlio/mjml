const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

describe('mj-carousel-image dark-src Outlook head style', function () {
  it('should not emit Outlook dark-mode head styles when no dark-src is present', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel support-dark-mode-image="outlook">
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
      .expect($('head style#css-dark-mode-outlook-com').get().length)
      .to.equal(0)
    chai.expect(html).to.not.include('@media (prefers-color-scheme:dark)')
    chai.expect(html).to.not.include('.mj-dark-image-bg')
  })

  it('should not emit Outlook dark-mode head styles when dark-src is present but support-dark-mode-image is not outlook', async function () {
    const darkUrl = 'https://example.com/carousel-dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image
            src="https://example.com/carousel-light.png"
            dark-src="${darkUrl}"
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
      .expect($('head style#css-dark-mode-outlook-com').get().length)
      .to.equal(0)

    chai.expect(html).to.not.include('@media (prefers-color-scheme:dark)')
    chai.expect(html).to.not.include('.mj-dark-image-bg')
    chai.expect(html).to.not.include('.mj-dark-image')
  })

  it('should emit Outlook dark-mode head styles when support-dark-mode-image is outlook with dark-src', async function () {
    const darkUrl = 'https://example.com/carousel-dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel support-dark-mode-image="outlook">
          <mj-carousel-image
            src="https://example.com/carousel-light.png"
            dark-src="${darkUrl}"
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
      .expect($('head style#css-dark-mode-outlook-com').get().length)
      .to.equal(1)

    const outlookStyle = $('head style#css-dark-mode-outlook-com').text()
    chai.expect(outlookStyle).to.include('[data-ogsb]')
    chai.expect(outlookStyle).to.include(darkUrl)
    chai.expect(outlookStyle).to.include('[data-ogsb] .mj-dark-image-1')
    chai.expect(outlookStyle).to.not.include('[data-ogsb] .mj-dark-image-2')
    chai.expect(outlookStyle).to.match(/background-size:\s*100%\s+100%/)

    chai.expect(html).to.include('@media (prefers-color-scheme:dark)')
    chai.expect(html).to.include('.mj-dark-image-bg')
    chai.expect(html).to.include('.mj-dark-image')
  })

  it('should reuse the same class for main and thumbnail when dark-thumbnails-src is omitted', async function () {
    const darkUrl = 'https://example.com/carousel-dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel support-dark-mode-image="outlook">
          <mj-carousel-image
            src="https://example.com/carousel-light.png"
            dark-src="${darkUrl}"
          />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)

    // Thumbnail should reuse the main class when dark-thumbnails-src is omitted.
    chai
      .expect(
        $(
          '.mj-carousel-thumbnail .mj-dark-image-1 picture source',
        ).attr('srcset'),
      )
      .to.equal(darkUrl)

    // Main image should use the same class.
    chai
      .expect(
        $(
          '.mj-carousel-image .mj-dark-image-1 picture source',
        ).attr('srcset'),
      )
      .to.equal(darkUrl)

    const outlookStyle = $('head style#css-dark-mode-outlook-com').text()
    // Only one class should be emitted when the thumbnail reuses the main dark image.
    chai.expect(outlookStyle).to.include('[data-ogsb] .mj-dark-image-1')
    chai.expect(outlookStyle).to.not.include('[data-ogsb] .mj-dark-image-2')
    chai.expect(outlookStyle).to.include(darkUrl)
  })

  it('should use different classes for main and thumbnail when dark-thumbnails-src differs', async function () {
    const darkMainUrl = 'https://example.com/carousel-dark.png'
    const darkThumbUrl = 'https://example.com/carousel-thumb-dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel support-dark-mode-image="outlook">
          <mj-carousel-image
            src="https://example.com/carousel-light.png"
            dark-src="${darkMainUrl}"
            dark-thumbnails-src="${darkThumbUrl}"
          />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)

    // Thumbnail renders first and gets its own class when dark-thumbnails-src differs.
    chai
      .expect(
        $(
          '.mj-carousel-thumbnail .mj-dark-image-1 picture source',
        ).attr('srcset'),
      )
      .to.equal(darkThumbUrl)

    // Main image renders later and uses a separate class.
    chai
      .expect(
        $(
          '.mj-carousel-image .mj-dark-image-2 picture source',
        ).attr('srcset'),
      )
      .to.equal(darkMainUrl)

    const outlookStyle = $('head style#css-dark-mode-outlook-com').text()
    // Should have both class definitions with correct URLs
    chai.expect(outlookStyle).to.include('[data-ogsb] .mj-dark-image-1')
    chai.expect(outlookStyle).to.include('[data-ogsb] .mj-dark-image-2')
    chai.expect(outlookStyle).to.include(darkThumbUrl)
    chai.expect(outlookStyle).to.include(darkMainUrl)
  })

  it('should emit Outlook dark-mode styles when only dark-thumbnails-src is present', async function () {
    const darkThumbUrl = 'https://example.com/carousel-thumb-dark-only.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel support-dark-mode-image="outlook">
          <mj-carousel-image
            src="https://example.com/carousel-light.png"
            dark-thumbnails-src="${darkThumbUrl}"
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
      .expect($('head style#css-dark-mode-outlook-com').get().length)
      .to.equal(1)

    chai
      .expect(
        $(
          '.mj-carousel-thumbnail .mj-dark-image-1 picture source',
        ).attr('srcset'),
      )
      .to.equal(darkThumbUrl)
  })

  it('should keep href as the immediate parent of picture inside Outlook dark-mode wrappers', async function () {
    const darkUrl = 'https://example.com/carousel-dark-linked.png'
    const href = 'https://mjml.io/carousel'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel support-dark-mode-image="outlook">
          <mj-carousel-image
            src="https://example.com/carousel-light-linked.png"
            dark-src="${darkUrl}"
            href="${href}"
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
        $('.mj-carousel-image .mj-dark-image-1 > a > picture > source').attr('srcset'),
      )
      .to.equal(darkUrl)

    chai
      .expect($('.mj-carousel-image .mj-dark-image-1 > a').attr('href'))
      .to.equal(href)

    chai
      .expect($('.mj-carousel-image > a .mj-dark-image-1').get().length)
      .to.equal(0)
  })

  it('should emit a single Outlook dark-mode head style across multiple carousels', async function () {
    const darkUrlOne = 'https://example.com/carousel-dark-one.png'
    const darkUrlTwo = 'https://example.com/carousel-dark-two.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel support-dark-mode-image="outlook">
          <mj-carousel-image
            src="https://example.com/carousel-light-one.png"
            dark-src="${darkUrlOne}"
          />
        </mj-carousel>
        <mj-carousel support-dark-mode-image="outlook">
          <mj-carousel-image
            src="https://example.com/carousel-light-two.png"
            dark-src="${darkUrlTwo}"
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
      .expect($('head style#css-dark-mode-outlook-com').get().length)
      .to.equal(1)

    const outlookStyle = $('head style#css-dark-mode-outlook-com').text()
    chai.expect(outlookStyle).to.include(darkUrlOne)
    chai.expect(outlookStyle).to.include(darkUrlTwo)
  })
})
