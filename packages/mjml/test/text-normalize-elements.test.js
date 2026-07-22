const chai = require('chai')
const { load } = require('cheerio')

const mjml = require('../lib')

function headConditional(html) {
  // Return the content of all <!--[if mso]>...<![endif]--> blocks joined
  const blocks = []
  const re = /<!--\[if mso\]>([\s\S]*?)<!\[endif\]-->/g
  let m
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(html)) !== null) blocks.push(m[1])
  return blocks.join('\n')
}

function wrapText(normalizeAttr, content) {
  const attr = normalizeAttr ? ` normalize-elements="${normalizeAttr}"` : ''
  return `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text${attr}>${content}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
}

describe('mj-text normalize-elements', function () {
  // ─── div wrapper ───────────────────────────────────────────────────────────

  describe('containing div', function () {
    it('adds class="normalize" to the content div when the attribute is set', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul><li>A</li></ul>'),
      )
      const $ = load(html)
      chai.expect($('div.normalize').length).to.equal(1)
    })

    it('does NOT add class="normalize" when the attribute is absent', async function () {
      const { html } = await mjml(wrapText(null, '<ul><li>A</li></ul>'))
      const $ = load(html)
      chai.expect($('div.normalize').length).to.equal(0)
    })

    it('combines "normalize" with an existing css-class', async function () {
      const { html } = await mjml(`
<mjml><mj-body><mj-section><mj-column>
  <mj-text normalize-elements="ul" css-class="my-text"><ul><li>A</li></ul></mj-text>
</mj-column></mj-section></mj-body></mjml>`)
      const $ = load(html)
      // The css-class goes on the wrapping <td>, normalize on the inner <div>
      chai.expect($('div.normalize').length).to.equal(1)
      chai.expect($('td.my-text').length).to.equal(1)
    })
  })

  // ─── MSO head style ────────────────────────────────────────────────────────

  describe('MSO conditional head style', function () {
    it('emits the MSO block when normalize-elements is set', async function () {
      const { html } = await mjml(wrapText('ul', '<ul><li>A</li></ul>'))
      const conditional = headConditional(html)
      chai.expect(conditional).to.include('.normalize ul')
      chai.expect(conditional).to.include('.normalize li')
    })

    it('does NOT emit the MSO block when normalize-elements is absent', async function () {
      const { html } = await mjml(wrapText(null, '<ul><li>A</li></ul>'))
      chai.expect(html).to.not.include('.normalize ul')
    })

    it('emits the MSO block only once when multiple mj-text components use normalize-elements', async function () {
      const { html } = await mjml(`
<mjml><mj-body><mj-section><mj-column>
  <mj-text normalize-elements="ul"><ul><li>A</li></ul></mj-text>
  <mj-text normalize-elements="ol"><ol><li>B</li></ol></mj-text>
</mj-column></mj-section></mj-body></mjml>`)
      const occurrences = (html.match(/\.normalize ul/g) || []).length
      chai.expect(occurrences).to.equal(1)
    })
  })

  // ─── element selection ─────────────────────────────────────────────────────

  describe('element selection', function () {
    it('only normalises ul when normalize-elements="ul"', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul><li>A</li></ul><ol><li>B</li></ol>'),
      )
      const $ = load(html)
      chai.expect($('ul[style]').attr('style')).to.include('padding: 0')
      // ol should be untouched (no injected style)
      chai.expect($('ol').attr('style')).to.equal(undefined)
    })

    it('only normalises ol when normalize-elements="ol"', async function () {
      const { html } = await mjml(
        wrapText('ol', '<ul><li>A</li></ul><ol><li>B</li></ol>'),
      )
      const $ = load(html)
      chai.expect($('ol[style]').attr('style')).to.include('padding: 0')
      chai.expect($('ul').attr('style')).to.equal(undefined)
    })

    it('normalises both when normalize-elements="ul,ol"', async function () {
      const { html } = await mjml(
        wrapText('ul,ol', '<ul><li>A</li></ul><ol><li>B</li></ol>'),
      )
      const $ = load(html)
      chai.expect($('ul[style]').attr('style')).to.include('padding: 0')
      chai.expect($('ol[style]').attr('style')).to.include('padding: 0')
    })

    it('tolerates spaces around the comma in the attribute value', async function () {
      const { html } = await mjml(
        wrapText('ul , ol', '<ul><li>A</li></ul><ol><li>B</li></ol>'),
      )
      const $ = load(html)
      chai.expect($('ul[style]').attr('style')).to.include('padding: 0')
      chai.expect($('ol[style]').attr('style')).to.include('padding: 0')
    })

    it('ignores unknown element names in the attribute', async function () {
      const { html } = await mjml(
        wrapText('ul,blockquote', '<ul><li>A</li></ul><blockquote>B</blockquote>'),
      )
      const $ = load(html)
      chai.expect($('ul[style]').attr('style')).to.include('padding: 0')
      chai.expect($('blockquote').attr('style')).to.equal(undefined)
    })
  })

  // ─── ul/ol style injection ─────────────────────────────────────────────────

  describe('ul/ol style injection', function () {
    it('adds padding: 0 and margin: 0 when the element has no existing style', async function () {
      const { html } = await mjml(wrapText('ul', '<ul><li>A</li></ul>'))
      const $ = load(html)
      const style = $('ul').attr('style')
      chai.expect(style).to.match(/padding:\s*0/)
      chai.expect(style).to.match(/margin:\s*0/)
    })

    it('skips injecting padding when the element already has a padding shorthand', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul style="padding: 20px;"><li>A</li></ul>'),
      )
      const $ = load(html)
      const style = $('ul').attr('style')
      // margin: 0 should still be injected
      chai.expect(style).to.match(/margin:\s*0/)
      // our padding: 0 should NOT appear (user has padding: 20px)
      const decls = style.split(';').map((s) => s.trim())
      chai.expect(decls.filter((d) => /^padding\s*:\s*0/.test(d))).to.have.length(0)
    })

    it('skips injecting margin when the element already has a margin shorthand', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul style="margin: 10px;"><li>A</li></ul>'),
      )
      const $ = load(html)
      const style = $('ul').attr('style')
      // padding: 0 should still be injected
      chai.expect(style).to.match(/padding:\s*0/)
      const decls = style.split(';').map((s) => s.trim())
      chai.expect(decls.filter((d) => /^margin\s*:\s*0/.test(d))).to.have.length(0)
    })

    it('injects both when the element has only individual sub-properties', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul style="padding-left: 30px;"><li>A</li></ul>'),
      )
      const $ = load(html)
      const style = $('ul').attr('style')
      // Both shorthands injected; individual padding-left follows for cascade override
      chai.expect(style).to.match(/padding:\s*0/)
      chai.expect(style).to.match(/margin:\s*0/)
      chai.expect(style).to.include('padding-left: 30px')
    })

    it('puts injected properties before user properties so user values win in the cascade', async function () {
      const { html } = await mjml(
        wrapText('ol', '<ol style="color: red; padding: 20px;"><li>A</li></ol>'),
      )
      const $ = load(html)
      const style = $('ol').attr('style')
      // margin: 0 must appear before "color: red" (i.e. earlier in string)
      const marginPos = style.indexOf('margin')
      const colorPos = style.indexOf('color')
      chai.expect(marginPos).to.be.lessThan(colorPos)
    })

    it('preserves all user-supplied style properties', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul style="color: red; padding: 20px; padding-left: 30px;"><li>A</li></ul>'),
      )
      const $ = load(html)
      const style = $('ul').attr('style')
      chai.expect(style).to.include('color: red')
      chai.expect(style).to.include('padding: 20px')
      chai.expect(style).to.include('padding-left: 30px')
    })
  })

  // ─── li style and class injection ─────────────────────────────────────────

  describe('li style and class injection', function () {
    it('gives the first li margin-top: 10px', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul><li>A</li><li>B</li><li>C</li></ul>'),
      )
      const $ = load(html)
      const first = $('li').eq(0)
      chai.expect(first.attr('style')).to.match(/margin:\s*10px 0 5px 18px/)
    })

    it('gives middle li no positional class and margin-top: 0', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul><li>A</li><li>B</li><li>C</li></ul>'),
      )
      const $ = load(html)
      const middle = $('li').eq(1)
      chai.expect(middle.attr('style')).to.match(/margin:\s*0 0 5px 18px/)
    })

    it('gives the last li margin-bottom: 10px', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul><li>A</li><li>B</li><li>C</li></ul>'),
      )
      const $ = load(html)
      const last = $('li').eq(2)
      chai.expect(last.attr('style')).to.match(/margin:\s*0 0 10px 18px/)
    })

    it('does not inject margin when the li already has a margin shorthand', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul><li style="margin: 5px;">A</li></ul>'),
      )
      const $ = load(html)
      const li = $('li').eq(0)
      const style = li.attr('style')
      // Our margin shorthand must NOT appear
      const decls = style.split(';').map((s) => s.trim())
      chai.expect(decls.filter((d) => /^margin\s*:\s*10px/.test(d))).to.have.length(0)
      // User value preserved
      chai.expect(style).to.include('margin: 5px')
    })

    it('injects margin before user styles on a li', async function () {
      const { html } = await mjml(
        wrapText('ul', '<ul><li style="color: blue;">A</li></ul>'),
      )
      const $ = load(html)
      const style = $('li').eq(0).attr('style')
      const marginPos = style.indexOf('margin')
      const colorPos = style.indexOf('color')
      chai.expect(marginPos).to.be.lessThan(colorPos)
    })

  })

  // ─── nested lists ──────────────────────────────────────────────────────────

  describe('nested lists', function () {
    it('normalises nested ul inside ol when both are specified', async function () {
      const { html } = await mjml(
        wrapText('ul,ol', '<ol><li>A<ul><li>Nested</li></ul></li></ol>'),
      )
      const $ = load(html)
      chai.expect($('ol').attr('style')).to.match(/padding:\s*0/)
      chai.expect($('ul').attr('style')).to.match(/padding:\s*0/)
    })
  })
})
