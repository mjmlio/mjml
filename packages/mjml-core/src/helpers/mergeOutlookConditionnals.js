// # OPTIMIZE ME: — check if previous conditionnal is another Outlook conditional too
// Merge adjacent Outlook conditional blocks, supporting both
// `<!--[if mso]>` and the legacy `<!--[if mso | IE]>` forms.
//
// Important: do NOT merge across the negation closing marker `<!--<![endif]-->`
// used by `<!--[if !mso]><!-->` blocks, otherwise we end up stripping the
// closing part of the negation and the opening of the following MSO block and
// leave a stray `<!--` (as seen in mj-carousel fallback output).
export default (content) =>
  content.replace(
    /((?<!<!--)<!\[endif]-->\s*?<!--\[if mso(?: \| IE)?]>)/gm,
    '',
  )
