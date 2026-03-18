const assert = require('assert')
const mergeHeadStyleBlocks = require('../lib/helpers/mergeHeadStyleBlocks')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function head(inner) {
  return `<!doctype html>\n<html><head>${inner}</head>\n<body><p>hi</p></body></html>`
}

// ---------------------------------------------------------------------------

describe('mergeHeadStyleBlocks', () => {
  // -------------------------------------------------------------------------
  // Pass-through cases (no mutation)
  // -------------------------------------------------------------------------

  describe('pass-through — no head / malformed head', () => {
    it('returns html unchanged when there is no <head> tag', () => {
      const html = '<html><body><p>hello</p></body></html>'
      assert.strictEqual(mergeHeadStyleBlocks(html), html)
    })

    it('returns html unchanged when <head> has no closing >', () => {
      const html = '<html><head<style>a{}</style></head></html>'
      assert.strictEqual(mergeHeadStyleBlocks(html), html)
    })

    it('returns html unchanged when there is no </head> closing tag', () => {
      const html = '<html><head><style>a{}</style>'
      assert.strictEqual(mergeHeadStyleBlocks(html), html)
    })

    it('returns html unchanged when <head> is empty', () => {
      const html = head('')
      assert.strictEqual(mergeHeadStyleBlocks(html), html)
    })

    it('returns html unchanged when there are no <style> blocks at all', () => {
      const html = head('<title>T</title><meta charset="utf-8">')
      assert.strictEqual(mergeHeadStyleBlocks(html), html)
    })

    it('returns html unchanged when there is only one plain <style>', () => {
      const html = head('<style>body{margin:0}</style>')
      assert.strictEqual(mergeHeadStyleBlocks(html), html)
    })

    it('does not touch content outside <head>', () => {
      const bodyStyle = '<style>p{color:red}</style>'
      const html = `<html><head><style>a{}</style></head><body>${bodyStyle}</body></html>`
      const result = mergeHeadStyleBlocks(html)
      // body style must be present and unchanged
      assert.ok(result.includes(bodyStyle))
    })
  })

  // -------------------------------------------------------------------------
  // Basic merging
  // -------------------------------------------------------------------------

  describe('basic merging', () => {
    it('merges two consecutive plain <style> blocks into one', () => {
      const html = head('<style>a{color:red}</style><style>b{color:blue}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes('<style>a{color:red}\nb{color:blue}</style>'), result)
      assert.strictEqual((result.match(/<style>/g) || []).length, 1)
    })

    it('merges three consecutive plain <style> blocks into one', () => {
      const html = head('<style>a{}</style><style>b{}</style><style>c{}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes('<style>a{}\nb{}\nc{}</style>'), result)
      assert.strictEqual((result.match(/<style>/g) || []).length, 1)
    })

    it('preserves CSS content exactly (including newlines and whitespace within CSS)', () => {
      const css1 = '\n  body { margin: 0; }\n  p    { padding: 0; }\n'
      const css2 = '\n  a    { color: red; }\n'
      const html = head(`<style>${css1}</style><style>${css2}</style>`)
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes(`<style>${css1}\n${css2}</style>`), result)
    })

    it('handles empty <style></style> elements without crashing', () => {
      const html = head('<style></style><style>a{}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes('<style>\na{}</style>'), result)
      assert.strictEqual((result.match(/<style>/g) || []).length, 1)
    })
  })

  // -------------------------------------------------------------------------
  // Whitespace between style blocks
  // -------------------------------------------------------------------------

  describe('whitespace between style blocks (transparent to merge groups)', () => {
    it('merges two plain styles separated by whitespace-only text', () => {
      const html = head('<style>a{}</style>\n    \n    <style>b{}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.strictEqual((result.match(/<style>/g) || []).length, 1)
      assert.ok(result.includes('<style>a{}\nb{}</style>'), result)
    })

    it('re-emits trailing whitespace that follows the last merged block', () => {
      const html = head('<style>a{}</style>\n    <style>b{}</style>\n  ')
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes('</style>\n  '), result)
    })

    it('merges three styles separated only by whitespace', () => {
      const html = head('<style>a{}</style>  <style>b{}</style>  <style>c{}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.strictEqual((result.match(/<style>/g) || []).length, 1)
    })
  })

  // -------------------------------------------------------------------------
  // Tokens that break a merge group
  // -------------------------------------------------------------------------

  describe('tokens that break a merge group', () => {
    it('does NOT merge two plain styles separated by an MSO conditional comment', () => {
      const sep = '<!--[if mso]><xml><o:Foo/></xml><![endif]-->'
      const html = head(`<style>a{}</style>${sep}<style>b{}</style>`)
      const result = mergeHeadStyleBlocks(html)
      assert.strictEqual((result.match(/<style>/g) || []).length, 2)
      assert.ok(result.includes(sep), result)
    })

    it('does NOT merge plain styles separated by a negation conditional comment', () => {
      const sep = '<!--[if !mso]><!--><style>c{}</style><!--<![endif]-->'
      // Two outer plain styles with an attributed block between them
      const html = head(`<style>a{}</style>${sep}<style>b{}</style>`)
      const result = mergeHeadStyleBlocks(html)
      // The outer plain styles are separated by the negation comment block,
      // so they must NOT be merged with each other
      assert.ok(!result.includes('<style>a{}\nb{}</style>'), result)
    })

    it('does NOT merge plain styles separated by a <meta> tag', () => {
      const html = head('<style>a{}</style><meta charset="utf-8"><style>b{}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.strictEqual((result.match(/<style>/g) || []).length, 2)
    })

    it('does NOT merge plain styles separated by a <title> tag', () => {
      const html = head('<style>a{}</style><title>My Email</title><style>b{}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.strictEqual((result.match(/<style>/g) || []).length, 2)
    })

    it('does NOT merge plain styles separated by a <link> tag', () => {
      const html = head('<style>a{}</style><link rel="stylesheet" href="x.css"><style>b{}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.strictEqual((result.match(/<style>/g) || []).length, 2)
    })

    it('does NOT merge plain styles separated by non-whitespace text', () => {
      const html = head('<style>a{}</style>some text<style>b{}</style>')
      const result = mergeHeadStyleBlocks(html)
      assert.strictEqual((result.match(/<style>/g) || []).length, 2)
    })
  })

  // -------------------------------------------------------------------------
  // Attributed <style> blocks
  // -------------------------------------------------------------------------

  describe('attributed <style> blocks', () => {
    it('does NOT merge a plain style with a <style media=...> block', () => {
      const html = head(
        '<style>a{}</style><style media="screen and (min-width:480px)">b{}</style>',
      )
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes('<style>a{}</style>'), result)
      assert.ok(result.includes('<style media="screen and (min-width:480px)">b{}</style>'), result)
    })

    it('does NOT merge two attributed <style> blocks with each other', () => {
      const html = head(
        '<style media="print">a{}</style><style media="print">b{}</style>',
      )
      const result = mergeHeadStyleBlocks(html)
      assert.strictEqual((result.match(/<style/g) || []).length, 2)
    })

    it('passes attributed <style> blocks through verbatim', () => {
      const block = '<style media="screen and (min-width:480px)">@media{}</style>'
      const html = head(block)
      assert.ok(mergeHeadStyleBlocks(html).includes(block))
    })
  })

  // -------------------------------------------------------------------------
  // Multiple independent merge groups
  // -------------------------------------------------------------------------

  describe('multiple independent merge groups', () => {
    it('merges each consecutive group independently', () => {
      // group 1: a + b, then breaker, then group 2: c + d
      const html = head(
        '<style>a{}</style><style>b{}</style>'
        + '<meta charset="utf-8">'
        + '<style>c{}</style><style>d{}</style>',
      )
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes('<style>a{}\nb{}</style>'), result)
      assert.ok(result.includes('<style>c{}\nd{}</style>'), result)
      assert.strictEqual((result.match(/<style>/g) || []).length, 2)
    })
  })

  // -------------------------------------------------------------------------
  // Realistic MJML skeleton output
  // -------------------------------------------------------------------------

  describe('realistic MJML-like head structure', () => {
    it('merges the base-styles block and the media-query block, leaves attributed style alone', () => {
      const baseStyles = '\n  body { margin:0; }\n  '
      const mqStyles = '\n  @media(min-width:480px){.a{width:600px!important}}\n  '
      const thunderbirdStyles = '\n  .moz-text-html .a {width:600px}\n  '

      const html = head(
        '<title>Test</title><meta charset="utf-8">'
        + `<style>${baseStyles}</style>`
        + `<style>${mqStyles}</style>`
        + `<style media="screen and (min-width:480px)">${thunderbirdStyles}</style>`,
      )
      const result = mergeHeadStyleBlocks(html)

      // The two plain styles should be merged
      assert.ok(result.includes(`<style>${baseStyles}\n${mqStyles}</style>`), result)
      // The attributed style must be untouched
      assert.ok(
        result.includes(`<style media="screen and (min-width:480px)">${thunderbirdStyles}</style>`),
        result,
      )
      // Total plain-style opens
      assert.strictEqual((result.match(/<style>/g) || []).length, 1)
    })

    it('keeps MSO conditional block between base-styles and media-query intact and prevents merge', () => {
      const msoBlock = '<!--[if mso]><noscript><xml><o:X/></xml></noscript><![endif]-->'
      const html = head(
        `<style>body{margin:0}</style>${msoBlock}<style>@media{}</style>`,
      )
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes(msoBlock), result)
      assert.strictEqual((result.match(/<style>/g) || []).length, 2)
    })
  })

  // -------------------------------------------------------------------------
  // Head tag with attributes
  // -------------------------------------------------------------------------

  describe('<head> tag with attributes', () => {
    it('handles <head> with XML namespace attributes', () => {
      const html = '<!doctype html><html><head xmlns="http://www.w3.org/1999/xhtml">'
        + '<style>a{}</style><style>b{}</style>'
        + '</head><body></body></html>'
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes('<style>a{}\nb{}</style>'), result)
      assert.strictEqual((result.match(/<style>/g) || []).length, 1)
    })
  })

  // -------------------------------------------------------------------------
  // Content outside head is untouched
  // -------------------------------------------------------------------------

  describe('content outside <head> is untouched', () => {
    it('does not modify <style> tags inside <body>', () => {
      const bodyPart = '<body><div style="color:red"><style>p{}</style></div></body>'
      const html = `<html><head><style>a{}</style></head>${bodyPart}</html>`
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.includes(bodyPart), result)
    })

    it('does not modify content before <!doctype>', () => {
      const before = '<!-- pre-doctype comment -->\n'
      const html = `${before}<!doctype html><html><head><style>a{}</style><style>b{}</style></head></html>`
      const result = mergeHeadStyleBlocks(html)
      assert.ok(result.startsWith(before), result)
    })
  })
})
