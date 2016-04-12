import { ParseError, EmptyMJMLError, NullElementError } from '../Error'
import compact from 'lodash/compact'
import dom from '../helpers/dom'
import filter from 'lodash/filter'
import MJMLElements, { endingTags } from '../MJMLElementsCollection'
import warning from 'warning'

/**
 * Avoid htmlparser to parse ending tags
 */
const safeEndingTags = content => {
  endingTags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*)>([^]*?)</${tag}>`, 'gmi')
    content = content.replace(regex, dom.replaceContentByCdata(tag))
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

/**
 * Import an html document containing some mjml
 * returns JSON
 *   - container: the mjml container
 *   - mjml: a json representation of the mjml
 */
const documentParser = content => {
  let root

  try {
    const $ = dom.parseXML(safeEndingTags(content))
    root = $('mjml content')

    if (root.length < 1) {
      root = $('mj-body').get(0)
      warning(false, 'Please upgrade your MJML markup to add a <mjml> root tag, <mj-body> as root will no longer be supported soon')
    } else {
      root = root.children().get(0)
    }
  } catch (e) {
    throw new ParseError('Error while parsing the file')
  }

  if (root.length < 1) {
    throw new EmptyMJMLError('No root "<mjml>" found in the file')
  }

  return mjmlElementParser(root)
}

export default documentParser
