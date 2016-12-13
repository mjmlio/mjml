import compact from 'lodash/compact'
import each from 'lodash/each'
import toArray from 'lodash/toArray';
import filter from 'lodash/filter'
import warning from 'warning'
import { ParseError, EmptyMJMLError, NullElementError } from '../Error'
import dom from '../helpers/dom'
import { endingTags } from '../MJMLElementsCollection'
import MJMLHeadElements from '../MJMLHead'

const regexTag = tag => new RegExp(`<${tag}([^>]*)>([^]*?)</${tag}>`, 'gmi')

/**
 * Avoid htmlparser to parse ending tags
 */
const safeEndingTags = content => {
  const regexpBody = regexTag('mj-body')
  const safeContent = content.replace('$', '&#36;')

  let bodyContent = safeContent.match(regexpBody)

  if (!bodyContent) {
    return safeContent
  }

  bodyContent = bodyContent[0]

  endingTags.forEach(tag => {
    bodyContent = bodyContent.replace(regexTag(tag), dom.replaceContentByCdata(tag))
  })

  return safeContent.replace(regexpBody, bodyContent)
}

/**
 * converts MJML body into a JSON representation
 */
const mjmlElementParser = (elem, content) => {
  if (!elem) {
    throw new NullElementError('Null element found in mjmlElementParser')
  }

  const findLine = content.substr(0, elem.startIndex).match(/\n/g)
  const lineNumber = findLine ? findLine.length + 1 : 1
  const tagName = elem.tagName.toLowerCase()
  const attributes = dom.getAttributes(elem)

  const element = { tagName, attributes, lineNumber }

  if (endingTags.indexOf(tagName) !== -1) {
    const $local = dom.parseXML(elem)
    element.content = $local(tagName).html().trim()
  } else {
    const children = dom.getChildren(elem)
    element.children = children ? compact(filter(children, child => child.tagName).map(child => mjmlElementParser(child, content))) : []
  }

  return element
}

const parseHead = (head, attributes) => {
  const $container = dom.parseHTML(attributes.container)

  each(compact(filter(dom.getChildren(head), child => child.tagName)), el => {
    const element = {
      attributes: dom.getAttributes(el),
      children: toArray(el.childNodes),
      tagName: el.tagName.toLowerCase()
    };

    const handler = MJMLHeadElements[element.tagName]

    if (handler) {
      handler(element, { $container, ...attributes })
    } else {
      warning(false, `No handler found for: ${element.tagName}, in mj-head, skipping it`)
    }
  })

  attributes.container = dom.getHTML($container)
}

/**
 * Import an html document containing some mjml
 * returns JSON
 *   - container: the mjml container
 *   - mjml: a json representation of the mjml
 */
const documentParser = (content, attributes) => {
  const safeContent = safeEndingTags(content)

  let body
  let head

  try {
    const $ = dom.parseXML(safeContent)

    body = $('mjml > mj-body')
    head = $('mjml > mj-head')

    if (body.length > 0) {
      body = body.children().get(0)
    }
  } catch (e) {
    throw new ParseError('Error while parsing the file')
  }

  if (!body || body.length < 1) {
    throw new EmptyMJMLError('No root "<mjml>" or "<mj-body>" found in the file, or "<mj-body>" is empty')
  }

  if (head && head.length === 1) {
    parseHead(head.get(0), attributes)
  }

  return mjmlElementParser(body, safeContent)
}

export default documentParser
