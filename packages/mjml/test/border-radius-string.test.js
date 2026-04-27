const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

const VALUES = [
  '10px',
  '10% 20%',
  '10px 20px 30px',
  '10px 20% 30px 40%',
  '100px 50px 100px 50px / 50px 50px 50px 50px',
]

const render = async (template) => mjml(template, { minify: false })

const getBorderRadiusValuesFromHtml = (html) => {
  const $ = load(html)
  const values = []
  $('[style]').each(function collect() {
    const style = $(this).attr('style') || ''
    if (style.includes('border-radius')) {
      const val = extractStyle(style, 'border-radius')
      if (val) values.push(val)
    }
  })
  return Array.from(new Set(values))
}

const expectContainsAllValues = (html, label) => {
  const found = getBorderRadiusValuesFromHtml(html)
  for (const v of VALUES) {
    chai.expect(
      found,
      `${label} should include border-radius value: ${v}`,
    ).to.include(v)
  }
}

describe('border-radius accepts complex string values across components', function () {
  it('mj-button', async function () {
    const template = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              ${VALUES.map(
                (v) => `<mj-button border-radius="${v}">Button ${v}</mj-button>`,
              ).join('')}
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-button')
  })

  it('mj-image', async function () {
    const template = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              ${VALUES.map(
                (v) =>
                  `<mj-image src="https://example.com/img.png" border-radius="${v}" />`,
              ).join('')}
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-image')
  })

  it('mj-hero', async function () {
    const template = `
      <mjml>
        <mj-body>
          ${VALUES.map(
            (v) => `
            <mj-hero border-radius="${v}" background-color="#eee">
              <mj-text>Hero ${v}</mj-text>
            </mj-hero>
          `,
          ).join('')}
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-hero')
  })

  it('mj-section and mj-column', async function () {
    const template = `
      <mjml>
        <mj-body>
          ${VALUES.map(
            (v) => `
            <mj-section border-radius="${v}">
              <mj-column border-radius="${v}" padding="20px">
                <mj-text>Section/Column ${v}</mj-text>
              </mj-column>
            </mj-section>
          `,
          ).join('')}
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-section/mj-column')
  })

  it('mj-column inner-border-radius', async function () {
    const template = `
      <mjml>
        <mj-body>
          ${VALUES.map(
            (v) => `
            <mj-section>
              <mj-column border-radius="0px" inner-border-radius="${v}" padding="20px">
                <mj-text>Column inner ${v}</mj-text>
              </mj-column>
            </mj-section>
          `,
          ).join('')}
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-column inner-border-radius')
  })

  it('mj-social and mj-social-element', async function () {
    const template = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              ${VALUES.map(
                (v) => `
                <mj-social border-radius="${v}">
                  <mj-social-element name="facebook" href="#" border-radius="${v}">FB</mj-social-element>
                </mj-social>
              `,
              ).join('')}
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-social/mj-social-element')
  })

  it('mj-carousel and mj-carousel-image', async function () {
    const template = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              ${VALUES.map(
                (v) => `
                <mj-carousel border-radius="${v}">
                  <mj-carousel-image src="https://example.com/img1.png" border-radius="${v}" />
                  <mj-carousel-image src="https://example.com/img2.png" border-radius="${v}" />
                </mj-carousel>
              `,
              ).join('')}
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-carousel/mj-carousel-image')
  })

  it('mj-carousel-image tb-border-radius', async function () {
    const template = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              ${VALUES.map(
                (v) => `
                <mj-carousel>
                  <mj-carousel-image src="https://example.com/img1.png" tb-border-radius="${v}" />
                </mj-carousel>
              `,
              ).join('')}
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-carousel-image tb-border-radius')
  })

  it('mj-carousel tb-border-radius', async function () {
    const template = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              ${VALUES.map(
                (v) => `
                <mj-carousel tb-border-radius="${v}" thumbnails="visible">
                  <mj-carousel-image src="https://example.com/img1.png" />
                  <mj-carousel-image src="https://example.com/img2.png" />
                </mj-carousel>
              `,
              ).join('')}
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await render(template)
    expectContainsAllValues(html, 'mj-carousel tb-border-radius')
  })
})
