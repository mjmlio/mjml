const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

describe('mj-image dark-src head style', function () {
  it('should not emit dark-mode head styles when no dark-src is present', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="https://example.com/light.png" width="100px" />
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
    const darkUrl = 'https://example.com/dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="https://example.com/light.png" dark-src="${darkUrl}" width="100px" height="50px" />
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

  it('should emit Outlook dark-mode head styles when support-dark-mode-image is outlook', async function () {
    const darkUrl = 'https://example.com/dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="https://example.com/light.png" dark-src="${darkUrl}" support-dark-mode-image="outlook" width="100px" height="50px" />
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
    chai.expect(outlookStyle).to.include('[data-ogsb] .mj-dark-image-1 > div')
    chai.expect(outlookStyle).to.match(/background-size:\s*100%\s+100%/)
    chai.expect(outlookStyle).to.not.include('.mj-dark-image.mj-dark-image-1')

    chai.expect(html).to.include('@media (prefers-color-scheme:dark)')
    chai.expect(html).to.include('.mj-dark-image-bg')
    chai.expect(html).to.include('.mj-dark-image')
  })

  it('should emit a single Outlook dark-mode head style across multiple images', async function () {
    const darkUrlOne = 'https://example.com/dark-one.png'
    const darkUrlTwo = 'https://example.com/dark-two.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image
          src="https://example.com/light-one.png"
          dark-src="${darkUrlOne}"
          support-dark-mode-image="outlook"
          width="100px"
        />
        <mj-image
          src="https://example.com/light-two.png"
          dark-src="${darkUrlTwo}"
          support-dark-mode-image="outlook"
          width="100px"
        />
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
