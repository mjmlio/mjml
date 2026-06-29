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

function getImageCell($) {
  return $('img').parents('td').first()
}

function wrapImage(attrs = '') {
  return `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="https://example.com/light.png" width="100px" ${attrs} />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-image dark-border-color / dark-container-background-color', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(
      wrapImage('container-background-color="#eeeeee" border="2px solid #333333"'),
    )

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
    chai.expect(html).to.not.include('[data-ogsb] .mj-dark-')
  })

  it('should apply dark-container-background-color class to the wrapper td', async function () {
    const { html } = await mjml(
      wrapImage('css-class="my-image" dark-container-background-color="#111111"'),
    )

    const styles = headStyles(html)
    const $ = load(html)

    const containerClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )

    chai.expect(containerClassMatch).to.not.equal(null)

    const darkClass = containerClassMatch[1]

    chai.expect($('td.my-image').attr('class')).to.equal(`my-image ${darkClass}`)
    chai.expect($(`td.${darkClass}`).length).to.equal(1)
    chai.expect($(`img.${darkClass}`).length).to.equal(0)
  })

  it('should apply dark-border-color class to the wrapper td, not the img element', async function () {
    const { html } = await mjml(
      wrapImage('css-class="my-image" border="2px solid #333333" dark-border-color="#ff0000"'),
    )

    const styles = headStyles(html)
    const $ = load(html)

    const borderClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #ff0000 !important;[^}]*\}/,
    )

    chai.expect(borderClassMatch).to.not.equal(null)

    const darkClass = borderClassMatch[1]

    chai.expect($(`td.${darkClass}`).length).to.equal(1)
    chai.expect($(`img.${darkClass}`).length).to.equal(0)
  })

  it('should use a single dark class for dark-border-color and side overrides on td', async function () {
    const { html } = await mjml(
      wrapImage(
        'border="2px solid #333333" dark-border-color="orange" dark-border-top-color="hotpink" dark-border-bottom-color="hotpink" dark-border-left-color="purple"',
      ),
    )

    const styles = headStyles(html)

    const borderColorClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: orange !important;[^}]*\}/,
    )
    const borderTopClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-top-color: hotpink !important;[^}]*\}/,
    )
    const borderBottomClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-bottom-color: hotpink !important;[^}]*\}/,
    )
    const borderLeftClass = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-left-color: purple !important;[^}]*\}/,
    )

    chai.expect(borderColorClass).to.not.equal(null)
    chai.expect(borderTopClass).to.not.equal(null)
    chai.expect(borderBottomClass).to.not.equal(null)
    chai.expect(borderLeftClass).to.not.equal(null)

    chai.expect(borderTopClass[1]).to.equal(borderColorClass[1])
    chai.expect(borderBottomClass[1]).to.equal(borderColorClass[1])
    chai.expect(borderLeftClass[1]).to.equal(borderColorClass[1])
  })

  it('should not emit Outlook border rules when support-dark-mode-image is outlook', async function () {
    const { html } = await mjml(
      wrapImage(
        'dark-src="https://example.com/dark.png" support-dark-mode-image="outlook" dark-border-color="#ff0000" dark-container-background-color="#111111"',
      ),
    )

    const styles = headStyles(html)

    chai.expect(styles).to.not.match(/\[data-ogsb\] \.mj-dark-image-\d+\s*\{[^}]*border/)
    chai.expect(styles).to.include('border-color: #ff0000 !important;')
    chai.expect(html).to.include('css-dark-mode-outlook-com')
  })

  it('should use separate classes for container background and image border', async function () {
    const { html } = await mjml(
      wrapImage(
        'css-class="my-image" dark-container-background-color="#111111" dark-border-color="#ff0000"',
      ),
    )

    const styles = headStyles(html)
    const $ = load(html)

    const containerClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )
    const borderClassMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #ff0000 !important;[^}]*\}/,
    )

    chai.expect(containerClassMatch).to.not.equal(null)
    chai.expect(borderClassMatch).to.not.equal(null)
    chai.expect(containerClassMatch[1]).to.not.equal(borderClassMatch[1])

    chai.expect($('td.my-image').attr('class')).to.equal(
      `my-image ${containerClassMatch[1]}`,
    )
    chai.expect(getImageCell($).attr('class')).to.equal(borderClassMatch[1])
    chai.expect($('img').attr('class')).to.equal(undefined)
  })

})