import _ from 'lodash'

export function buildFontsTags (content, fonts = {}) {
  const toImport = []

  _.forEach(fonts, (url, name) => {
    const regex = new RegExp(`"[^"]*font-family:[^"]*${name}[^"]*"`, 'gmi')

    if (content.match(regex)) {
      toImport.push(url)
    }
  })

  if (toImport.length > 0) {
    return `
      <!--[if !mso]><!-->
        ${_.map(toImport, url => `<link href="${url}" rel="stylesheet" type="text/css">`).join('\n')}
        <style type="text/css">
          ${_.map(toImport, url => `@import url(${url});`).join('\n')}
        </style>
      <!--<![endif]-->\n
    `
  }

  return ''
}
