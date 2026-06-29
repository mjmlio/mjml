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

// Column with padding → gutter td exists; outer dark class goes on that td,
// inner dark class goes on the column table inside it.
function wrapColumnGutter(attrs = '') {
  return `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column
        background-color="#cccccc"
        inner-background-color="#eeeeee"
        border="2px solid #333333"
        inner-border="1px solid #666666"
        padding="10px"
        ${attrs}
      >
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

// Column without padding → no gutter td; outer dark class goes on the column table.
function wrapColumnNoGutter(attrs = '') {
  return `
<mjml support-dark-mode="true">
  <mj-body>
    <mj-section>
      <mj-column
        background-color="#cccccc"
        border="2px solid #333333"
        ${attrs}
      >
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-column dark-background-color / dark-border-color / dark-inner-background-color / dark-inner-border-color', function () {
  it('should not emit dark-mode styles when no dark attributes are set', async function () {
    const { html } = await mjml(wrapColumnGutter())

    chai.expect(html).to.not.include('prefers-color-scheme')
    chai.expect(html).to.not.include('.mj-dark-')
  })

  it('should apply dark-background-color class to the gutter td (not the column table) when padding exists', async function () {
    const { html } = await mjml(wrapColumnGutter('dark-background-color="#111111"'))
    const styles = headStyles(html)
    const $ = load(html)

    const classMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )
    chai.expect(classMatch, 'dark class with background-color: #111111 should exist').to.not.equal(null)
    const darkClass = classMatch[1]

    // Outer class must be on the gutter td (a <td>), not the column table (<table>)
    chai
      .expect($(`td.${darkClass}`).length, 'dark class should be on a <td> (gutter)')
      .to.equal(1)
    chai
      .expect($(`table.${darkClass}`).length, 'dark class should NOT be on a <table>')
      .to.equal(0)
  })

  it('should apply dark-background-color class to the column table (not a td) when no gutter', async function () {
    const { html } = await mjml(wrapColumnNoGutter('dark-background-color="#111111"'))
    const styles = headStyles(html)
    const $ = load(html)

    const classMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )
    chai.expect(classMatch, 'dark class with background-color: #111111 should exist').to.not.equal(null)
    const darkClass = classMatch[1]

    // Without gutter the outer class must be on the column table, not a td
    chai
      .expect($(`table.${darkClass}`).length, 'dark class should be on a <table>')
      .to.equal(1)
    chai
      .expect($(`td.${darkClass}`).length, 'dark class should NOT be on a <td>')
      .to.equal(0)
  })

  it('should put dark-background-color and dark-border-color in the same outer class on the gutter td', async function () {
    const { html } = await mjml(
      wrapColumnGutter('dark-background-color="#111111" dark-border-color="#ff0000"'),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const bgMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )
    const borderMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #ff0000 !important;[^}]*\}/,
    )
    chai.expect(bgMatch, 'dark background class should exist').to.not.equal(null)
    chai.expect(borderMatch, 'dark border class should exist').to.not.equal(null)
    // Both declarations must share the same class name
    chai
      .expect(bgMatch[1], 'background and border-color should share one class')
      .to.equal(borderMatch[1])
    // That shared class must be on the gutter td
    chai
      .expect($(`td.${bgMatch[1]}`).length, 'outer class should be on gutter <td>')
      .to.equal(1)
  })

  it('should group all outer border side overrides under the same class', async function () {
    const { html } = await mjml(
      wrapColumnGutter(
        'dark-border-color="orange" dark-border-top-color="hotpink" dark-border-bottom-color="hotpink" dark-border-left-color="purple"',
      ),
    )
    const styles = headStyles(html)

    const borderColorMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: orange !important;[^}]*\}/,
    )
    const borderTopMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-top-color: hotpink !important;[^}]*\}/,
    )
    const borderBottomMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-bottom-color: hotpink !important;[^}]*\}/,
    )
    const borderLeftMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-left-color: purple !important;[^}]*\}/,
    )

    chai.expect(borderColorMatch, 'border-color match').to.not.equal(null)
    chai.expect(borderTopMatch, 'border-top-color match').to.not.equal(null)
    chai.expect(borderBottomMatch, 'border-bottom-color match').to.not.equal(null)
    chai.expect(borderLeftMatch, 'border-left-color match').to.not.equal(null)

    // All side overrides must share the parent border class
    chai.expect(borderTopMatch[1]).to.equal(borderColorMatch[1])
    chai.expect(borderBottomMatch[1]).to.equal(borderColorMatch[1])
    chai.expect(borderLeftMatch[1]).to.equal(borderColorMatch[1])
  })

  it('should not emit a side override when value equals dark-border-color', async function () {
    const { html } = await mjml(
      wrapColumnGutter(
        'dark-border-color="#ff0000" dark-border-top-color="#ff0000"',
      ),
    )
    const styles = headStyles(html)

    // Only one border-color rule should exist, no duplicate border-top-color
    chai.expect(styles).to.not.include('border-top-color: #ff0000 !important;')
  })

  it('should apply dark-inner-background-color to the inner column table, not the gutter td', async function () {
    const { html } = await mjml(wrapColumnGutter('dark-inner-background-color="#222222"'))
    const styles = headStyles(html)
    const $ = load(html)

    const classMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #222222 !important;[^}]*\}/,
    )
    chai.expect(classMatch, 'inner dark class should exist').to.not.equal(null)
    const darkClass = classMatch[1]

    // Inner class must be on the column table (<table>), not the gutter td
    chai
      .expect($(`table.${darkClass}`).length, 'inner dark class should be on <table>')
      .to.equal(1)
    chai
      .expect($(`td.${darkClass}`).length, 'inner dark class should NOT be on <td>')
      .to.equal(0)
  })

  it('should put dark-inner-background-color and dark-inner-border-color in the same inner class', async function () {
    const { html } = await mjml(
      wrapColumnGutter(
        'dark-inner-background-color="#222222" dark-inner-border-color="#aaaaaa"',
      ),
    )
    const styles = headStyles(html)
    const $ = load(html)

    const bgMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #222222 !important;[^}]*\}/,
    )
    const borderMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: #aaaaaa !important;[^}]*\}/,
    )
    chai.expect(bgMatch, 'inner dark background class should exist').to.not.equal(null)
    chai.expect(borderMatch, 'inner dark border class should exist').to.not.equal(null)
    chai
      .expect(bgMatch[1], 'inner background and border-color should share one class')
      .to.equal(borderMatch[1])
    chai
      .expect($(`table.${bgMatch[1]}`).length, 'inner class should be on <table>')
      .to.equal(1)
  })

  it('should group all inner border side overrides under the same inner class', async function () {
    const { html } = await mjml(
      wrapColumnGutter(
        'dark-inner-border-color="teal" dark-inner-border-top-color="lime" dark-inner-border-right-color="lime"',
      ),
    )
    const styles = headStyles(html)

    const innerBorderMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-color: teal !important;[^}]*\}/,
    )
    const innerTopMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-top-color: lime !important;[^}]*\}/,
    )
    const innerRightMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*border-right-color: lime !important;[^}]*\}/,
    )

    chai.expect(innerBorderMatch, 'inner border-color match').to.not.equal(null)
    chai.expect(innerTopMatch, 'inner border-top-color match').to.not.equal(null)
    chai.expect(innerRightMatch, 'inner border-right-color match').to.not.equal(null)

    chai.expect(innerTopMatch[1]).to.equal(innerBorderMatch[1])
    chai.expect(innerRightMatch[1]).to.equal(innerBorderMatch[1])
  })

  it('should use separate classes for outer and inner when both are provided', async function () {
    const { html } = await mjml(
      wrapColumnGutter(
        'dark-background-color="#111111" dark-border-color="#ff0000" dark-inner-background-color="#222222" dark-inner-border-color="#aaaaaa"',
      ),
    )
    const styles = headStyles(html)

    const outerBgMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #111111 !important;[^}]*\}/,
    )
    const innerBgMatch = styles.match(
      /\.(mj-dark-\d+) \{[^}]*background-color: #222222 !important;[^}]*\}/,
    )
    chai.expect(outerBgMatch, 'outer class should exist').to.not.equal(null)
    chai.expect(innerBgMatch, 'inner class should exist').to.not.equal(null)
    chai
      .expect(outerBgMatch[1], 'outer and inner classes should be different')
      .to.not.equal(innerBgMatch[1])
  })

  it('should emit a single prefers-color-scheme block when multiple columns have dark rules', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column
        padding="10px"
        dark-background-color="#111111"
        dark-inner-background-color="#222222"
      >
        <mj-text>One</mj-text>
      </mj-column>
      <mj-column
        padding="10px"
        dark-border-color="#ff0000"
        dark-inner-border-color="#00ff00"
      >
        <mj-text>Two</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

    const { html } = await mjml(input)
    const styles = headStyles(html)
    const mediaMatches = styles.match(/@media \(prefers-color-scheme: dark\)/g) || []

    chai.expect(mediaMatches.length).to.equal(1)
    chai.expect(styles).to.include('background-color: #111111 !important;')
    chai.expect(styles).to.include('background-color: #222222 !important;')
    chai.expect(styles).to.include('border-color: #ff0000 !important;')
    chai.expect(styles).to.include('border-color: #00ff00 !important;')
  })
})
