import dom from '../helpers/dom'

const buildTags = ($, toImport) => {
  if (!toImport.length) {
    return
  }

  $('head').append(`\n<!--[if !mso]><!-->
    ${toImport.map(url => `<link href="${url}" rel="stylesheet" type="text/css">`).join('\n')}
    <style type="text/css">\n
      ${toImport.map(url => `  @import url(${url});`).join('\n')}\n
    </style>
  <!--<![endif]-->`)
}

export default (options = {}) => {
  const { fonts, $ } = options
  const content = dom.getHTML($)

  const toImport = []

  fonts.forEach(font => {
    const { name, url } = font
    const regex = new RegExp(`"[^"]*font-family:[^"]*${name}[^"]*"`)

    if (content.match(regex)) {
      toImport.push(url)
    }
  })

  return buildTags($, toImport)
}
