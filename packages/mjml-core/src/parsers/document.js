import { ParseError, EmptyMJMLError, NullElementError } from '../Error'
import compact from 'lodash/compact'
import dom from '../helpers/dom'
import each from 'lodash/each'
import filter from 'lodash/filter'
import MJMLElements, { endingTags } from '../MJMLElementsCollection'
import MJMLHeadElements from '../MJMLHead'
import warning from 'warning'

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

  bodyContent = bodyContent[0].replace('$', '&#36;') // $ is a protected chars for regexp... avoid issue with duplicate content

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

/**
 * Import an html document containing some mjml
 * returns JSON
 *   - container: the mjml container
 *   - mjml: a json representation of the mjml
 */
const documentParser = (content, attributes) => {
  let root
  let head

  try {
    const $ = dom.parseXML(safeEndingTags(content))
    root = $('mjml > mj-body')
    head = $('mjml > mj-head')

    if (root.length < 1) {
      root = $('mj-body').get(0)
      warning(false, 'Please upgrade your MJML markup to add a <mjml> root tag, <mj-body> as root will no longer be supported soon, see https://github.com/mjmlio/mjml/blob/master/UPGRADE.md')
    } else {
      root = root.children().get(0)
    }
  } catch (e) {
    throw new ParseError('Error while parsing the file')
  }

  if (!root || root.length < 1) {
    throw new EmptyMJMLError('No root "<mjml>" or "<mj-body>" found in the file')
  }

  if (head && head.length === 1) {
    parseHead(head.get(0), attributes)
  }

  return mjmlElementParser(root)
}

export default documentParser
