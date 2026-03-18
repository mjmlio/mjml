// Merge consecutive plain (no-attribute) <style> blocks inside <head> into one.
//
// This function deliberately avoids using cheerio so that it works in browser
// environments where cheerio is a webpack external (and therefore undefined).
//
// The head content is tokenised with a plain character scanner.  Three token
// types are recognised:
//
//   'plain-style'  – <style> with no attributes          (eligible for merging)
//   'whitespace'   – whitespace-only text between tags   (transparent to groups)
//   'other'        – everything else                     (breaks an open group)
//
// Consecutive runs of plain-style tokens (separated at most by whitespace)
// are combined into a single <style> block.  All other tokens are emitted
// verbatim.  Content outside <head>…</head> is never touched.
export default function mergeHeadStyleBlocks(html) {
  const headOpen = html.indexOf('<head')
  if (headOpen === -1) {
    return html
  }

  const headOpenEnd = html.indexOf('>', headOpen)
  if (headOpenEnd === -1) {
    return html
  }

  const headClose = html.indexOf('</head>', headOpenEnd)
  if (headClose === -1) {
    return html
  }

  const headOpenTag = html.slice(headOpen, headOpenEnd + 1)
  const headInner = html.slice(headOpenEnd + 1, headClose)
  const before = html.slice(0, headOpen)
  const after = html.slice(headClose)

  const tokens = []
  let pos = 0
  while (pos < headInner.length) {
    let advanced = false

    // HTML comment (<!-- ... -->), including MSO conditionals and negations
    if (
      headInner[pos] === '<' &&
      headInner[pos + 1] === '!' &&
      headInner[pos + 2] === '-' &&
      headInner[pos + 3] === '-'
    ) {
      const end = headInner.indexOf('-->', pos + 4)
      if (end !== -1) {
        tokens.push({ type: 'other', raw: headInner.slice(pos, end + 3) })
        pos = end + 3
        advanced = true
      }
    }

    // Plain <style> with no attributes — eligible for merging
    if (!advanced && headInner.startsWith('<style>', pos)) {
      const end = headInner.indexOf('</style>', pos + 7)
      if (end !== -1) {
        const css = headInner.slice(pos + 7, end)
        tokens.push({ type: 'plain-style', css, raw: headInner.slice(pos, end + 8) })
        pos = end + 8
        advanced = true
      }
    }

    // <style> with attributes (e.g. media=) — not eligible for merging
    if (
      !advanced &&
      headInner.startsWith('<style', pos) &&
      pos + 6 < headInner.length &&
      headInner[pos + 6] !== '>'
    ) {
      const tagEnd = headInner.indexOf('>', pos + 6)
      if (tagEnd !== -1) {
        const bodyEnd = headInner.indexOf('</style>', tagEnd + 1)
        if (bodyEnd !== -1) {
          tokens.push({ type: 'other', raw: headInner.slice(pos, bodyEnd + 8) })
          pos = bodyEnd + 8
          advanced = true
        }
      }
    }

    // Text content between tags
    if (!advanced && headInner[pos] !== '<') {
      const nextTag = headInner.indexOf('<', pos)
      const end = nextTag === -1 ? headInner.length : nextTag
      const raw = headInner.slice(pos, end)
      tokens.push({ type: raw.trim() === '' ? 'whitespace' : 'other', raw })
      pos = end
      advanced = true
    }

    // Any other tag (<meta>, <title>, <link>, etc.)
    if (!advanced) {
      const tagEnd = headInner.indexOf('>', pos)
      if (tagEnd !== -1) {
        tokens.push({ type: 'other', raw: headInner.slice(pos, tagEnd + 1) })
        pos = tagEnd + 1
      } else {
        tokens.push({ type: 'other', raw: headInner.slice(pos) })
        pos = headInner.length
      }
    }
  }

  // Walk the token list merging consecutive plain-style groups.
  // Whitespace-only tokens between plain-style tokens are absorbed.
  // Whitespace that trails after the last merged style in a group is
  // re-emitted so surrounding layout is preserved.  Any other token
  // closes the current group.
  const out = []
  let i = 0
  while (i < tokens.length) {
    const t = tokens[i]
    if (t.type === 'plain-style') {
      let combinedCss = t.css
      let trailingWhitespace = ''
      let j = i + 1
      while (j < tokens.length) {
        const nt = tokens[j]
        if (nt.type === 'whitespace') {
          trailingWhitespace += nt.raw
          j += 1
        } else if (nt.type === 'plain-style') {
          combinedCss += `\n${nt.css}`
          trailingWhitespace = ''
          j += 1
        } else {
          break
        }
      }
      out.push(`<style>${combinedCss}</style>`)
      if (trailingWhitespace) out.push(trailingWhitespace)
      i = j
    } else {
      out.push(t.raw)
      i += 1
    }
  }

  return `${before}${headOpenTag}${out.join('')}${after}`
}
