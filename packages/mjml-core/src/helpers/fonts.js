import forEach from 'lodash/forEach'
import map from 'lodash/map'

export function buildFontsTags (content, fonts = {}) {
  const toImport = []

  forEach(fonts, (url, name) => {
    const regex = new RegExp(`"[^"]*font-family:[^"]*${name}[^"]*"`, 'gmi')

    if (content.match(regex)) {
      toImport.push(url)
    }
  })

  if (toImport.length > 0) {
    return `
      <!--[if !mso]><!-->
        ${map(toImport, url => `<link href="${url}" rel="stylesheet" type="text/css">`).join('\n')}
        <style type="text/css">
          ${map(toImport, url => `@import url(${url});`).join('\n')}
        </style>
      <!--<![endif]-->\n
    `
  }

  return ''
}
