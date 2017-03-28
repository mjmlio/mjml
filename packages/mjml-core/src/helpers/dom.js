import isBrowser from './isBrowser'

const dom = {}

if (isBrowser()) {
  const jquery = require('jquery')

  const parseMarkup = str => {
    const context = jquery(str)

    return selector => {
      if (!selector) {
        return jquery(context)
      }

      return jquery(selector, context)
    }
  }

  dom.parseHTML = str => {
    const parser = new DOMParser()

    return parseMarkup(parser.parseFromString(str, 'text/html'))
  }

  dom.parseXML = str => {
    if (typeof str !== 'string') {
      str = str.outerHTML
    }

    return parseMarkup(jquery.parseXML(`<root>${str}</root>`))
  }

  dom.getAttributes = element => {
    const attributes = {}

    Array.prototype.slice.call(element.attributes).forEach(attribute => attributes[attribute.name] = attribute.value)

    return attributes
  }

  dom.getChildren = element => {
    return Array.from(element.childNodes).filter((node) => {
      return node.nodeType === 1
    })
  }

  dom.replaceContentByCdata = tag => `<${tag}$1><!--[CDATA[$2]]--></${tag}>`

  dom.getHTML = $ => {
    const markup = $()[0]

    return `<!doctype ${markup.doctype.name}>${markup.documentElement.outerHTML}`
  }
} else {
  const cheerio = require('cheerio')

  let $ = cheerio.load('', { decodeEntities: false })

  const parseMarkup = (str, options) => {
    $ = $.load(str, options)

    return selector => {
      if (!selector) {
        return $
      }

      return $(selector)
    }
  }

  dom.parseHTML = str => parseMarkup(str, { xmlMode: false, decodeEntities: false })

  dom.parseXML = str => parseMarkup(str, { xmlMode: true, decodeEntities: false, withStartIndices: true })

  dom.getAttributes = element => element.attribs || {}

  dom.getChildren = element => element.childNodes

  dom.replaceContentByCdata = tag => `<${tag}$1><![CDATA[$2]]></${tag}>`

  dom.getHTML = $ => $().html()
}

export default dom
