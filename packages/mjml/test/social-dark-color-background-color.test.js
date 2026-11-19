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

function wrapSocial(socialAttrs = '', elementAttrs = '', text = 'Facebook') {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social ${socialAttrs}>
          <mj-social-element
            name="facebook"
            href="https://example.com"
            ${elementAttrs}
          >
            ${text}
          </mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-social / mj-social-element dark color/background', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(wrapSocial('color="#333333"', 'color="#000000"'))

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should apply mj-social color--dark to child text when mj-social-element has no color--dark', async function () {
    const { html } = await mjml(wrapSocial('color--dark="#ffffff"'))
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('@media (prefers-color-scheme: dark)')
    chai.expect(styles).to.include('.mj-dark-1 { color: #ffffff !important; }')
    chai.expect($('a.mj-dark-1').get().length).to.be.at.least(1)
  })

  it('should apply mj-social container-background-color--dark to the social container td', async function () {
    const { html } = await mjml(wrapSocial('container-background-color--dark="#1a1a1a"'))
    const styles = headStyles(html)
    const $ = load(html)

    chai
      .expect(styles)
      .to.include('.mj-dark-1 { background-color: #1a1a1a !important; }')
    chai.expect($('td.mj-dark-1').get().length).to.be.at.least(1)
    chai.expect($('table.mj-dark-1').get().length).to.equal(0)
  })

  it('should let mj-social-element color--dark override inherited mj-social color--dark', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social color--dark="#ffffff">
          <mj-social-element name="facebook" href="https://example.com" color--dark="#00ff00">
            First
          </mj-social-element>
          <mj-social-element name="twitter" href="https://example.com">
            Second
          </mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
    const { html } = await mjml(input)
    const styles = headStyles(html)

    chai.expect(styles).to.include('.mj-dark-1 { color: #00ff00 !important; }')
    chai.expect(styles).to.include('.mj-dark-2 { color: #ffffff !important; }')
  })

  it('should keep mj-social container-background-color--dark distinct from mj-social-element background-color--dark', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social container-background-color--dark="#111111">
          <mj-social-element name="facebook" href="https://example.com" background-color--dark="#222222">
            First
          </mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
    const { html } = await mjml(input)
    const styles = headStyles(html)
    const $ = load(html)

    chai.expect(styles).to.include('.mj-dark-1 { background-color: #111111 !important; }')
    chai.expect(styles).to.include('.mj-dark-2 { background-color: #222222 !important; }')
    chai.expect($('td.mj-dark-1').get().length).to.be.at.least(1)
    chai.expect($('td.mj-dark-2').get().length).to.be.at.least(1)
    chai.expect($('table.mj-dark-1').get().length).to.equal(0)
    chai.expect($('table.mj-dark-2').get().length).to.equal(0)
  })

  it('should not emit [data-ogsb] dark rules by default', async function () {
    const { html } = await mjml(
      wrapSocial('container-background-color--dark="#1a1a1a" color--dark="#ffffff"'),
    )
    const styles = headStyles(html)

    chai
      .expect(styles)
      .to.not.include('[data-ogsb] .mj-dark-1 { background-color: #1a1a1a !important; }')
    chai
      .expect(styles)
      .to.not.include('[data-ogsb] .mj-dark-2 { color: #ffffff !important; }')
  })

  it('should not emit [data-ogsb] color rules when only support-dark-mode-image is outlook', async function () {
    const { html } = await mjml(
      wrapSocial(
        'container-background-color--dark="#1a1a1a" color--dark="#ffffff"',
        'support-dark-mode-image="outlook"',
      ),
    )
    const styles = headStyles(html)

    chai
      .expect(styles)
      .to.not.include('[data-ogsb] .mj-dark-1 { background-color: #1a1a1a !important; }')
    chai
      .expect(styles)
      .to.not.include('[data-ogsb] .mj-dark-2 { color: #ffffff !important; }')
  })
})
