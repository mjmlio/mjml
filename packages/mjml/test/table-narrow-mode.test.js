const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

function allHeadStyles(html) {
  const $ = load(html)
  return $('head style')
    .map(function () {
      return $(this).text()
    })
    .get()
    .join('\n')
}

function wrapTable(responsiveMode, content, extraAttrs = '') {
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table responsive-mode="${responsiveMode}" ${extraAttrs}>
          ${content}
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

const BASIC_TABLE = `
  <tr>
    <th>Year</th>
    <th>Language</th>
  </tr>
  <tr>
    <td>1995</td>
    <td>PHP</td>
  </tr>
`

// ─── stack ───────────────────────────────────────────────────────────────────

describe('mj-table responsive-mode="stack"', function () {
  it('adds mj-stack-table class to the table element', async function () {
    const { html } = await mjml(wrapTable('stack', BASIC_TABLE))
    const $ = load(html)
    chai.expect($('table.mj-stack-table').length).to.equal(1)
  })

  it('emits the stack @media CSS block once in the head', async function () {
    const { html } = await mjml(wrapTable('stack', BASIC_TABLE))
    const styles = allHeadStyles(html)
    chai.expect(styles).to.include('mj-stack-table:is(table)')
    chai.expect(styles).to.include('@media screen and (max-width: 479px)')
  })

  it('emits the stack CSS block only once when multiple stack tables are present', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table responsive-mode="stack">${BASIC_TABLE}</mj-table>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-table responsive-mode="stack">${BASIC_TABLE}</mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
    const { html } = await mjml(input)
    const styles = allHeadStyles(html)
    const occurrences = (styles.match(/mj-stack-table:is\(table\)/g) || []).length
    chai.expect(occurrences).to.be.greaterThan(0)
    // The block appears multiple times in the CSS (one rule per selector) but the
    // entire <style> tag is only injected once — verify there's only one @media block
    const mediaOccurrences = (styles.match(/@media screen and \(max-width: 479px\)/g) || []).length
    chai.expect(mediaOccurrences).to.equal(1)
  })

  it('does not add mj-stack-table class or emit stack CSS without responsive-mode', async function () {
    const { html } = await mjml(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table>${BASIC_TABLE}</mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`)
    const $ = load(html)
    chai.expect($('table.mj-stack-table').length).to.equal(0)
    chai.expect(allHeadStyles(html)).to.not.include('mj-stack-table')
  })

  // ─── injectDataLabels ───────────────────────────────────────────────────────

  it('injects data-label from <th> headers onto <td> cells', async function () {
    const { html } = await mjml(wrapTable('stack', BASIC_TABLE))
    const $ = load(html)
    const labels = $('table.mj-stack-table td[data-label]')
      .map(function () { return $(this).attr('data-label') })
      .get()
    chai.expect(labels).to.eql(['Year', 'Language'])
  })

  it('injects data-label correctly with thead / tbody structure', async function () {
    const content = `
      <thead>
        <tr><th>Year</th><th>Language</th><th>Inspired from</th></tr>
      </thead>
      <tbody>
        <tr><td>1995</td><td>PHP</td><td>C, Shell Unix</td></tr>
      </tbody>
    `
    const { html } = await mjml(wrapTable('stack', content))
    const $ = load(html)
    const labels = $('table.mj-stack-table td[data-label]')
      .map(function () { return $(this).attr('data-label') })
      .get()
    chai.expect(labels).to.eql(['Year', 'Language', 'Inspired from'])
  })

  it('handles <th> row headers in body rows: skips injection on <th>, applies correct label to following <td>', async function () {
    const content = `
      <tr><th>Title</th><th>Year</th><th>Language</th></tr>
      <tr><th>Row label</th><td>1995</td><td>PHP</td></tr>
    `
    const { html } = await mjml(wrapTable('stack', content))
    const $ = load(html)

    // The body <th> should not receive data-label
    const thLabels = $('table.mj-stack-table th[data-label]').length
    chai.expect(thLabels).to.equal(0)

    // The <td> cells should get labels offset by the row-header <th>
    const tdLabels = $('table.mj-stack-table td[data-label]')
      .map(function () { return $(this).attr('data-label') })
      .get()
    chai.expect(tdLabels).to.eql(['Year', 'Language'])
  })

  it('does not overwrite an existing data-label attribute', async function () {
    const content = `
      <tr><th>Year</th><th>Language</th></tr>
      <tr><td data-label="Custom">1995</td><td>PHP</td></tr>
    `
    const { html } = await mjml(wrapTable('stack', content))
    const $ = load(html)
    const labels = $('table.mj-stack-table td[data-label]')
      .map(function () { return $(this).attr('data-label') })
      .get()
    chai.expect(labels[0]).to.equal('Custom')
    chai.expect(labels[1]).to.equal('Language')
  })

  it('leaves content unchanged when no <th> headers are present', async function () {
    const content = `
      <tr><td>1995</td><td>PHP</td></tr>
    `
    const { html } = await mjml(wrapTable('stack', content))
    const $ = load(html)
    chai.expect($('table.mj-stack-table td[data-label]').length).to.equal(0)
  })
})

// ─── scroll ──────────────────────────────────────────────────────────────────

describe('mj-table responsive-mode="scroll"', function () {
  it('wraps content in a table.mj-scroll-table-outer', async function () {
    const { html } = await mjml(wrapTable('scroll', BASIC_TABLE))
    const $ = load(html)
    chai.expect($('table.mj-scroll-table-outer').length).to.equal(1)
  })

  it('places a div.mj-scroll-table-inner inside the outer table', async function () {
    const { html } = await mjml(wrapTable('scroll', BASIC_TABLE))
    const $ = load(html)
    chai.expect($('table.mj-scroll-table-outer div.mj-scroll-table-inner').length).to.equal(1)
  })

  it('places the data table inside div.mj-scroll-table-inner', async function () {
    const { html } = await mjml(wrapTable('scroll', BASIC_TABLE))
    const $ = load(html)
    const innerTable = $('div.mj-scroll-table-inner > table')
    chai.expect(innerTable.length).to.equal(1)
    chai.expect(innerTable.find('th').first().text()).to.equal('Year')
  })

  it('emits the scroll CSS once in the head', async function () {
    const { html } = await mjml(wrapTable('scroll', BASIC_TABLE))
    const styles = allHeadStyles(html)
    chai.expect(styles).to.include('.mj-scroll-table-outer')
    chai.expect(styles).to.include('.mj-scroll-table-inner')
    chai.expect(styles).to.include('overflow: auto')
    chai.expect(styles).to.include('table-layout: fixed')
  })

  it('emits scroll CSS only once with multiple scroll tables', async function () {
    const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table responsive-mode="scroll">${BASIC_TABLE}</mj-table>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-table responsive-mode="scroll">${BASIC_TABLE}</mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
    const { html } = await mjml(input)
    const styles = allHeadStyles(html)
    const occurrences = (styles.match(/mj-scroll-table-outer/g) || []).length
    // CSS rules reference the class multiple times, but the block is only injected once
    chai.expect(occurrences).to.be.greaterThan(0)
    chai
      .expect((styles.match(/table-layout: fixed/g) || []).length)
      .to.equal(1)
  })

  it('does not emit scroll CSS or wrapper without responsive-mode', async function () {
    const { html } = await mjml(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table>${BASIC_TABLE}</mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`)
    const $ = load(html)
    chai.expect($('table.mj-scroll-table-outer').length).to.equal(0)
    chai.expect(allHeadStyles(html)).to.not.include('mj-scroll-table-outer')
  })
})
