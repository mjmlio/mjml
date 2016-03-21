import _ from 'lodash'
import { endingTags } from './MJMLElementsCollection'
import { ParseError, EmptyMJMLError, NullElementError } from './Error'
import dom from './helpers/dom'

/**
 * Avoid htmlparser to parse ending tags
 */
const safeEndingTags = content => {
  endingTags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*)>([^]*?)<\/${tag}>`, 'gm')
    content = content.replace(regex, `<${tag} $1><!--[CDATA[$2]]--></${tag}>`)
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

  const tagName = elem.tagName.toLowerCase()
  const attributes = dom.getAttributes(elem)

  const element = { tagName, attributes }

  if (endingTags.indexOf(tagName) !== -1) {
    const $ = dom.parseXML(elem)
    element.content = $(tagName).html().trim()
  } else {
    const children = dom.getChildren(elem)
    element.children = children ? _.filter(children, child => child.tagName).map(mjmlElementParser) : []
  }

  return element
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
