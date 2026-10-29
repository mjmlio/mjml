import { castArray, forEach, map } from 'lodash'

// eslint-disable-next-line import/prefer-default-export
export function buildFontsTags(content, inlineStyle, fonts = {}) {
  const toImport = []

  // a font maps to one stylesheet url, or to several when mj-font is used
  // more than once with the same name
  forEach(fonts, (urls, name) => {
    const regex = new RegExp(`"[^"]*font-family:[^"]*${name}[^"]*"`, 'gmi')
    const inlineRegex = new RegExp(`font-family:[^;}]*${name}`, 'gmi')

    if (content.match(regex) || inlineStyle.some((s) => s.match(inlineRegex))) {
      toImport.push(...castArray(urls))
    }
  })

  if (toImport.length > 0) {
    return `
      <!--[if !mso]><!-->
        ${map(
          toImport,
          (url) => `<link href="${url}" rel="stylesheet" type="text/css">`,
        ).join('\n')}
        <style type="text/css">
          ${map(toImport, (url) => `@import url(${url});`).join('\n')}
        </style>
      <!--<![endif]-->\n
    `
  }

  return ''
}
