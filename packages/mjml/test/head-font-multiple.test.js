const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

const template = (head, fontFamily) => `
  <mjml>
    <mj-head>${head}</mj-head>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text font-family="${fontFamily}, Arial">Hello World!</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`

const importedFonts = (html) => {
  const $ = load(html)
  return {
    links: $('link')
      .map(function getHref() {
        return $(this).attr('href')
      })
      .get(),
    imports: html.match(/@import url\([^)]*\)/g) || [],
  }
}

describe('mj-font', function () {
  it('imports every stylesheet of mj-font tags that share a name', async function () {
    const { html } = await mjml(
      template(
        `<mj-font name="Raleway" href="https://fonts.example.com/raleway.css" />
         <mj-font name="Raleway" href="https://fonts.example.com/raleway-italic.css" />`,
        'Raleway',
      ),
    )

    chai.expect(importedFonts(html)).to.eql({
      links: [
        'https://fonts.example.com/raleway.css',
        'https://fonts.example.com/raleway-italic.css',
      ],
      imports: [
        '@import url(https://fonts.example.com/raleway.css)',
        '@import url(https://fonts.example.com/raleway-italic.css)',
      ],
    })
  })

  it('still replaces a font of the same name from the fonts option', async function () {
    const { html } = await mjml(
      template(
        `<mj-font name="Roboto" href="https://fonts.example.com/roboto.css" />
         <mj-font name="Roboto" href="https://fonts.example.com/roboto-italic.css" />`,
        'Roboto',
      ),
    )

    chai
      .expect(importedFonts(html).links)
      .to.eql([
        'https://fonts.example.com/roboto.css',
        'https://fonts.example.com/roboto-italic.css',
      ])
  })

  it('does not carry stylesheets over to the next render', async function () {
    const options = {
      fonts: { Raleway: 'https://fonts.example.com/configured.css' },
    }
    const head = `<mj-font name="Raleway" href="https://fonts.example.com/raleway.css" />
      <mj-font name="Raleway" href="https://fonts.example.com/raleway-italic.css" />`

    await mjml(template(head, 'Raleway'), options)
    const { html } = await mjml(template(head, 'Raleway'), options)

    chai
      .expect(importedFonts(html).links)
      .to.eql([
        'https://fonts.example.com/raleway.css',
        'https://fonts.example.com/raleway-italic.css',
      ])
  })

  it('does not import fonts that are not used', async function () {
    const { html } = await mjml(
      template(
        `<mj-font name="Lobster" href="https://fonts.example.com/lobster.css" />
         <mj-font name="Lobster" href="https://fonts.example.com/lobster-bold.css" />`,
        'Raleway',
      ),
    )

    chai.expect(importedFonts(html).links).to.eql([])
  })
})
