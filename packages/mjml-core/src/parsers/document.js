import { ParseError, EmptyMJMLError, NullElementError } from '../Error'
import compact from 'lodash/compact'
import dom from '../helpers/dom'
import each from 'lodash/each'
import filter from 'lodash/filter'
import MJMLElements, { endingTags, schemaXsds } from '../MJMLElementsCollection'
import MJMLHeadElements from '../MJMLHead'
import warning from 'warning'
import defaultXsd from '../configs/defaultXsd'
import { XsdError } from '../helpers/xsd'
import libXsd from 'libxml-xsd'

const regexTag = tag => new RegExp(`<${tag}([^>]*)>([^]*?)</${tag}>`, 'gmi')

/**
 * Avoid htmlparser to parse ending tags
 */
const safeEndingTags = content => {
  const regexpBody = regexTag('mj-body')
  let bodyContent = content.match(regexpBody)

  if (!bodyContent) {
    return content
  }

  bodyContent = bodyContent[0]

  endingTags.forEach(tag => {
    bodyContent = bodyContent.replace(regexTag(tag), dom.replaceContentByCdata(tag))
  })

  return content.replace(regexpBody, bodyContent)
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

  if (!MJMLElements[tagName]) {
    warning(false, `Unregistered element: ${tagName}, skipping it`)
    return
  }

  if (endingTags.indexOf(tagName) !== -1) {
    const $ = dom.parseXML(elem)
    element.content = $(tagName).html().trim()
  } else {
    const children = dom.getChildren(elem)
    element.children = children ? compact(filter(children, child => child.tagName).map(mjmlElementParser)) : []
  }

  return element
}

const parseHead = (head, attributes) => {
  const $container = dom.parseHTML(attributes.container)

  each(compact(filter(dom.getChildren(head), child => child.tagName)), element => {
    const handler = MJMLHeadElements[element.tagName.toLowerCase()]

    if (handler) {
      handler(element, { $container, ...attributes })
    } else {
      warning(false, `No handler found for: ${element.tagName}, in mj-head, skipping it`)
    }
  })

  attributes.container = dom.getHTML($container)
}

const validateDocument = (content) => {
  const schemaXsd = defaultXsd(schemaXsds.map(schemaXsd => schemaXsd(MJMLElements)).join(`\n`))

  const schema = libXsd.parse(schemaXsd)
  const errors = schema.validate(content)

  if (errors.length > 0) {
    throw new XsdError(errors)
  }
}

/**
 * Import an html document containing some mjml
 * returns JSON
 *   - container: the mjml container
 *   - mjml: a json representation of the mjml
 */
const documentParser = (content, attributes) => {
  const safeContent = safeEndingTags(content)

  let root
  let head

  try {
    const $ = dom.parseXML(safeContent)
    root = $('mjml > mj-body')
    head = $('mjml > mj-head')

    if (root.length > 0) {
      root = root.children().get(0)
    }
  } catch (e) {
    throw new ParseError('Error while parsing the file')
  }

  if (!root || root.length < 1) {
    throw new EmptyMJMLError('No root "<mjml>" or "<mj-body>" found in the file')
  }

  validateDocument(safeContent)

  if (head && head.length === 1) {
    parseHead(head.get(0), attributes)
  }

  return mjmlElementParser(root)
}

export default documentParser
