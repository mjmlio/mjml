import { endingTags, unsafeTags } from './MJMLElementsCollection'
import { loadXML } from './dom'
import { ParseError, EmptyMJMLError, NullElementError } from './Error'

const internals = {
  /**
   * Avoid htmlparser to parse ending tags
   */
  safeEndingTags (content) {
    unsafeTags.forEach(tag => {
      const tagRegexp = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'g')
      content = content.replace(tagRegexp, `<${tag}><![CDATA[$1]]></${tag}>`);
    })

    return content
  },
  /**
   * converts MJML body into a JSON representation
   */
  mjmlElementParser (elem) {
    if (!elem) {
      throw new NullElementError('Null element found in mjmlElementParser')
    }

    const that = internals.mjmlElementParser
    const tagName = elem.tagName
    const attributes = elem.attribs
    let content

    const children = elem.childNodes ? elem.childNodes.filter(child => child.tagName).map(that) : []

    if (endingTags.indexOf(tagName) != -1) {
      const $ = loadXML(elem, { decodeEntities: false })
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
  documentParser (content) {
    let body

    try {
      const $ = loadXML(internals.safeEndingTags(content), { decodeEntities: true })
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
