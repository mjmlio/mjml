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

function wrapAccordion({
  accordionAttrs = '',
  elementAttrs = '',
  titleAttrs = '',
  textAttrs = '',
} = {}) {
  return `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-accordion
          css-class="acc-root"
          border="2px solid #000000"
          container-background-color="#f0f0f0"
          ${accordionAttrs}
        >
          <mj-accordion-element
            css-class="acc-el"
            border="1px solid #333333"
            background-color="#eeeeee"
            ${elementAttrs}
          >
            <mj-accordion-title
              css-class="acc-title"
              background-color="#dddddd"
              color="#111111"
              ${titleAttrs}
            >Title</mj-accordion-title>
            <mj-accordion-text
              css-class="acc-text"
              background-color="#cccccc"
              color="#222222"
              ${textAttrs}
            >Text</mj-accordion-text>
          </mj-accordion-element>
        </mj-accordion>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-accordion dark colors', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(wrapAccordion())

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should inherit mj-accordion dark-border-color on title/text inner tables', async function () {
    const { html } = await mjml(
      wrapAccordion({
        accordionAttrs: 'dark-border-color="#00ff00"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('border-color: #00ff00 !important;')
    chai.expect(styles).to.include('border-bottom-color: #00ff00 !important;')

    const titleTableClass = $('.mj-accordion-title table').attr('class') || ''
    const textTableClass = $('.mj-accordion-content table').attr('class') || ''

    chai.expect(titleTableClass).to.match(/mj-dark-\d+/)
    chai.expect(textTableClass).to.match(/mj-dark-\d+/)
  })

  it('should apply mj-accordion-element dark-border-color on title/text inner tables', async function () {
    const { html } = await mjml(
      wrapAccordion({
        elementAttrs: 'dark-border-color="#ababab"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('border-bottom-color: #ababab !important;')

    const titleTableClass = $('.mj-accordion-title table').attr('class') || ''
    const textTableClass = $('.mj-accordion-content table').attr('class') || ''

    chai.expect(titleTableClass).to.match(/mj-dark-\d+/)
    chai.expect(textTableClass).to.match(/mj-dark-\d+/)
  })

  it('should let mj-accordion-element dark-border-color override inherited mj-accordion dark-border-color', async function () {
    const { html } = await mjml(
      wrapAccordion({
        accordionAttrs: 'dark-border-color="#00ff00"',
        elementAttrs: 'dark-border-color="#ababab"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('border-color: #00ff00 !important;')
    chai.expect(styles).to.include('border-bottom-color: #ababab !important;')

    const titleTableClass = $('.mj-accordion-title table').attr('class') || ''
    const textTableClass = $('.mj-accordion-content table').attr('class') || ''

    chai.expect(titleTableClass).to.match(/mj-dark-\d+/)
    chai.expect(textTableClass).to.match(/mj-dark-\d+/)
  })

  it('should combine mj-accordion-title dark-background-color with inherited dark-border-color on one title table class', async function () {
    const { html } = await mjml(
      wrapAccordion({
        elementAttrs: 'dark-border-color="#ababab"',
        titleAttrs: 'dark-background-color="#1a1a1a"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('background-color: #1a1a1a !important;')
    chai.expect(styles).to.include('border-bottom-color: #ababab !important;')

    const titleTableClass = $('.mj-accordion-title table').attr('class') || ''
    chai.expect(titleTableClass).to.match(/mj-dark-\d+/)
    chai.expect((titleTableClass.match(/mj-dark-\d+/g) || []).length).to.equal(1)
  })

  it('should apply mj-accordion-title dark-color on title td only', async function () {
    const { html } = await mjml(
      wrapAccordion({
        titleAttrs: 'dark-color="#fefefe"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('color: #fefefe !important;')

    const titleTdClass = $('.mj-accordion-title td.acc-title').attr('class') || ''
    const textTdClass = $('.mj-accordion-content td.acc-text').attr('class') || ''

    chai.expect(titleTdClass).to.match(/mj-dark-\d+/)
    chai.expect(textTdClass).to.equal('acc-text')
  })

  it('should use dark icon sources when dark-icon-wrapped-url and dark-icon-unwrapped-url are set', async function () {
    const darkWrapped = 'https://example.com/dark-more.png'
    const darkUnwrapped = 'https://example.com/dark-less.png'

    const { html } = await mjml(
      wrapAccordion({
        titleAttrs: `dark-icon-wrapped-url="${darkWrapped}" dark-icon-unwrapped-url="${darkUnwrapped}"`,
      }),
    )
    const $ = load(html)

    chai
      .expect(
        $('.mj-accordion-more + source[media="(prefers-color-scheme: dark)"]').attr('srcset') ||
        $('picture source[media="(prefers-color-scheme: dark)"]').first().attr('srcset'),
      )
      .to.equal(darkWrapped)
    chai
      .expect(
        $('picture source[media="(prefers-color-scheme: dark)"]').last().attr('srcset'),
      )
      .to.equal(darkUnwrapped)
  })

  it('should apply mj-accordion-text dark-background-color and dark-color using a single dark class on text td', async function () {
    const { html } = await mjml(
      wrapAccordion({
        textAttrs: 'dark-background-color="#1b1b1b" dark-color="#eeeeee"',
      }),
    )
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('background-color: #1b1b1b !important;')
    chai.expect(styles).to.include('color: #eeeeee !important;')

    const textTdClass = $('.mj-accordion-content td.acc-text').attr('class') || ''

    chai.expect(textTdClass).to.match(/mj-dark-\d+/)
    chai.expect((textTdClass.match(/mj-dark-\d+/g) || []).length).to.equal(1)
  })
})
