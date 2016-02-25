import { endingTags, unsafeTags } from './MJMLElementsCollection'
import { ParseError, EmptyMJMLError, NullElementError } from './Error'
import dom from './helpers/dom'

/**
 * Avoid htmlparser to parse ending tags
 */
const safeEndingTags = content => {
  unsafeTags.forEach(tag => {
    const tagRegexp = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'g')
    content = content.replace(tagRegexp, `<${tag}><![CDATA[$1]]></${tag}>`)
  })

  return content
}

/**
 * converts MJML body into a JSON representation
 */
const mjmlElementParser = elem => {
  if (!elem) {
    throw new NullElementError('Null element found in mjmlElementParser')
  }

  const tagName = elem.tagName
  const attributes = elem.attribs

  let content
  let children

  if (endingTags.indexOf(tagName) !== -1) {
    const $ = dom.parseXML(elem)
    content = $(tagName).html().trim()
  } else {
    children = elem.childNodes ? elem.childNodes.filter(child => child.tagName).map(mjmlElementParser) : []
  }

  return { tagName, attributes, children, content }
}

/**
 * Import an html document containing some mjml
 * returns JSON
 *   - container: the mjml container
 *   - mjml: a json representation of the mjml
 */
const documentParser = content => {
  let body

  try {
    const $ = dom.parseXML(safeEndingTags(content))
    body = $('mj-body')
  } catch (e) {
    throw new ParseError('Error while parsing the file')
  }

  if (!body) {
    throw new EmptyMJMLError('No mj-body found in the file')
  }

  return mjmlElementParser(body.get(0))
}

export default documentParser
