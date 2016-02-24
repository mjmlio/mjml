import cheerio from 'cheerio'

export const loadXML = (xml, { decodeEntities }) => cheerio.load(xml, { xmlMode: true, decodeEntities })
export const loadHTML = html => cheerio.load(html)
export const getHTML = $ => $.html()
