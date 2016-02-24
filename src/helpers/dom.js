const inBrowser = typeof window !== 'undefined'
let $

if (inBrowser) {
  $ = require('jquery')
} else {
  const cheerio = require('cheerio')
  $ = cheerio.load('', { decodeEntities: false })

  const parseMarkup = (str, options) => $.load(str, options)

  $.parseHTML = str => parseMarkup(str, { xmlMode: false })
  $.parseXML = str => parseMarkup(str, { xmlMode: true })
}

export default $
