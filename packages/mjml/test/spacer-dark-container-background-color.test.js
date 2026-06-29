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

function wrapSpacer(attrs = '') {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-spacer ${attrs} />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-spacer dark-container-background-color', function () {
  it('should not emit dark-mode styles when no dark-container-background-color is set', async function () {
    const { html } = await mjml(wrapSpacer('container-background-color="#ffffff"'))

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should emit only the media-query background-color rule by default', async function () {
    const { html } = await mjml(
      wrapSpacer('container-background-color="#ffffff" dark-container-background-color="#1a1a1a"'),
    )
    const styles = headStyles(html)
    const classMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #1a1a1a !important;[^}]*\}/,
    )

    chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
    chai.expect(classMatch).to.not.equal(null)
    chai.expect(styles).to.not.include(`[data-ogsb] .${classMatch[1]} { background-color: #1a1a1a !important; }`)
  })

  it('should apply the dark class to the column wrapper <td>', async function () {
    const { html } = await mjml(
      wrapSpacer('dark-container-background-color="#1a1a1a"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const classMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #1a1a1a !important;[^}]*\}/,
    )

    chai.expect(classMatch).to.not.equal(null)
    const darkClass = classMatch[1]

    chai.expect($(`td.${darkClass}`).get().length).to.equal(1)
    chai.expect($(`div.${darkClass}`).get().length).to.equal(0)
  })

  it('should preserve an existing css-class when merging the dark class', async function () {
    const { html } = await mjml(
      wrapSpacer('css-class="my-spacer" dark-container-background-color="#1a1a1a"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const classMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #1a1a1a !important;[^}]*\}/,
    )

    chai.expect(classMatch).to.not.equal(null)

    chai.expect($('td.my-spacer').attr('class')).to.equal(`my-spacer ${classMatch[1]}`)
  })

  it('should accumulate rules from multiple mj-spacer components into one style block', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-spacer dark-container-background-color="#111111" />
        <mj-spacer dark-container-background-color="#222222" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const styles = headStyles(html)

    chai.expect(styles).to.include('.mj-dark-1 { background-color: #111111 !important; }')
    chai.expect(styles).to.include('.mj-dark-2 { background-color: #222222 !important; }')

    chai
      .expect(styles.split('@media (prefers-color-scheme: dark)').length - 1)
      .to.equal(1)
  })
})
