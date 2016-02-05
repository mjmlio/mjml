import cheerio from "cheerio"
import { endingTags } from './MJMLElementsCollection'
import { ParseError, EmptyMJMLError, NullElementError } from './Error'

const internals = {
  /**
   * converts MJML body into a JSON representation
   */
  mjmlElementParser(elem) {
    if (!elem) {
      throw new NullElementError('Null element found in mjmlElementParser')
    }

    const that = internals.mjmlElementParser
    const tagName = elem.tagName
    const attributes = elem.attribs
    let content

    const children = elem.childNodes ?
            elem.childNodes.filter(child => child.tagName).map(that) : []

    if (endingTags.indexOf(tagName) != -1) {
      const $ = cheerio.load(elem, { xmlMode: true, decodeEntities: false })
      content = $(tagName).html().trim()
    }

    return { tagName, attributes, children, content }
  },

  /**
   * Import an html document containing some mjml
   * returns JSON
   *   - container: the mjml container
   *   - mjml: a json representation of the mjml
   */
  documentParser(content) {
    let $, body;
    try {
      $ = cheerio.load(content, { xmlMode: true })
      body = $('mj-body')
    } catch (e) {
      throw new ParseError('Error while parsing the file')
    }

    if (!body) {
      throw new EmptyMJMLError('No mj-body found in the file')
    }

    return internals.mjmlElementParser(body.get(0))
  }
};

export default internals.documentParser
