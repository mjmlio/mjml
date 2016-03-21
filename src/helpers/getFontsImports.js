import listFontsImports from '../configs/listFontsImports'

const buildTags = toImport => {
  const tags = {}

  if (!toImport.length) {
    return tags
  }

  tags.link = "\n" + toImport.map(url => `<link href="${url}" rel="stylesheet" type="text/css">`).join('\n')
  tags.import = `\n<style type="text/css">\n` +
    toImport.map(url => `  @import url(${url});`).join('\n') + "\n" +
  '</style>'

  return tags
}

export default (options = {}) => {
  const { importAll, content } = options

  if (importAll) {
    return buildTags(listFontsImports.map(font => font.url))
  }

  const toImport = []

  listFontsImports.forEach(font => {
    const { name, url } = font
    const regex = new RegExp(`"[^"]*font-family:[^"]*${name}[^"]*"`)

    if (content.match(regex)) {
      toImport.push(url)
    }
  })

  return buildTags(toImport)
}
