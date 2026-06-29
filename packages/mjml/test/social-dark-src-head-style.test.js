const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

describe('mj-social dark-src head style', function () {
  it('should not emit dark-mode head styles when no dark-src is present', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social>
          <mj-social-element
            name="facebook"
            href="https://example.com"
            src="https://example.com/social-light.png"
          >
            Facebook
          </mj-social-element>
        </mj-social>
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

  it('should not emit Outlook dark-mode head styles when support-dark-mode-image is not outlook', async function () {
    const darkUrl = 'https://example.com/social-dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social>
          <mj-social-element
            name="facebook"
            href="https://example.com"
            src="https://example.com/social-light.png"
            dark-src="${darkUrl}"
          >
            Facebook
          </mj-social-element>
        </mj-social>
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

  it('should emit Outlook dark-mode head styles and wrapper when support-dark-mode-image is outlook', async function () {
    const darkUrl = 'https://example.com/social-dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social>
          <mj-social-element
            name="facebook"
            href="https://example.com"
            src="https://example.com/social-light.png"
            dark-src="${darkUrl}"
            support-dark-mode-image="outlook"
          >
            Facebook
          </mj-social-element>
        </mj-social>
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

    chai.expect(html).to.include('@media (prefers-color-scheme:dark)')
    chai.expect(html).to.include('.mj-dark-image-bg')
    chai.expect(html).to.include('.mj-dark-image')
  })

  it('should preserve social-element background-color and emit dark-background-color overrides on Outlook wrapper', async function () {
    const darkUrl = 'https://example.com/social-dark.png'

    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social>
          <mj-social-element
            name="facebook"
            href="https://example.com"
            src="https://example.com/social-light.png"
            background-color="yellow"
            dark-background-color="#123456"
            dark-src="${darkUrl}"
            support-dark-mode-image="outlook"
          >
            Facebook
          </mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const $ = load(html)
    const outlookStyle = $('head style#css-dark-mode-outlook-com').text()

    const backgroundWrapperClass =
      ($('.mj-dark-image-bg').attr('class') || '')
        .split(' ')
        .find((className) => /^mj-dark-image-bg-\d+$/.test(className))

    chai.expect(backgroundWrapperClass).to.match(/^mj-dark-image-bg-\d+$/)
    chai.expect(html).to.match(/style="[^"]*background-color:\s*yellow;/)
    chai.expect(outlookStyle).to.match(new RegExp(`\\[data-ogsb\\]\\s+\\.${backgroundWrapperClass}\\s*\\{[^}]*background-color:\\s*#123456\\s*!important`))
    chai.expect(html).to.match(new RegExp(`\\.mj-dark-image-bg\\.${backgroundWrapperClass}:not\\(\\[class\\^="x_"\\]\\)\\s*\\{[^}]*background-color:\\s*#123456\\s*!important`))
  })

  it('should include all Outlook background override rules in the shared style blocks', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social>
          <mj-social-element
            name="facebook"
            href="https://example.com"
            src="https://example.com/social-light-f.png"
            background-color="yellow"
            dark-background-color="green"
            dark-src="https://email-placeholders.com/30x30/0000cc/transparent?text=F"
            support-dark-mode-image="outlook"
          >
            Facebook
          </mj-social-element>
          <mj-social-element
            name="google"
            href="https://example.com"
            src="https://example.com/social-light-g.png"
            background-color="orange"
            dark-background-color="blue"
            dark-src="https://email-placeholders.com/30x30/0000cc/transparent?text=G"
            support-dark-mode-image="outlook"
          >
            Google
          </mj-social-element>
        </mj-social>
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

    chai.expect(outlookStyle).to.match(/\[data-ogsb\]\s+\.mj-dark-image-bg-1\s*\{[^}]*background-color:\s*green\s*!important/)
    chai.expect(outlookStyle).to.match(/\[data-ogsb\]\s+\.mj-dark-image-bg-2\s*\{[^}]*background-color:\s*blue\s*!important/)
    chai.expect(html).to.match(/\.mj-dark-image-bg\.mj-dark-image-bg-1:not\(\[class\^="x_"\]\)\s*\{[^}]*background-color:\s*green\s*!important/)
    chai.expect(html).to.match(/\.mj-dark-image-bg\.mj-dark-image-bg-2:not\(\[class\^="x_"\]\)\s*\{[^}]*background-color:\s*blue\s*!important/)
  })
})
