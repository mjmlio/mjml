import MJMLElements, { endingTags } from '../MJMLElementsCollection'
import MJMLHeadElements, { endingTags as headEndingTags } from '../MJMLHead'
import { ParseError, EmptyMJMLError, NullElementError } from '../Error'
import compact from 'lodash/compact'
import concat from 'lodash/concat'
import dom from '../helpers/dom'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import parseAttributes from '../helpers/parseAttributes'
import removeCDATA from '../helpers/removeCDATA'
import toArray from 'lodash/toArray'

const regexTag = tag => new RegExp(`<${tag}([^>\/]*)>([^]*?)</${tag}>`, 'gmi')

/**
 * Avoid htmlparser to parse ending tags
 */
const safeEndingTags = content => {
  const MJElements = []

  forEach({
    ...MJMLElements,
    ...MJMLHeadElements
  }, (element, name) => {
    const tagName = element.tagName || name

    MJElements.push(tagName)
  })

  let safeContent = parseAttributes(MJElements, content.replace('$', '&#36;'))

  concat(endingTags, headEndingTags).forEach(tag => {
    safeContent = safeContent.replace(regexTag(tag), dom.replaceContentByCdata(tag))
  })

  return safeContent
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
  const attributes = mapValues(dom.getAttributes(elem), (val) => decodeURIComponent(val))

  const element = { tagName, attributes, lineNumber }

  if (endingTags.indexOf(tagName) !== -1) {
    const $local = dom.parseXML(elem)
    element.content = removeCDATA($local(tagName).html().trim())
  } else {
    const children = dom.getChildren(elem)
    element.children = children ? compact(filter(children, child => child.tagName).map(child => mjmlElementParser(child, content))) : []
  }

  return element
}

const parseHead = (head) => {
  return map(compact(filter(dom.getChildren(head), child => child.tagName)), el => {
    const $local = dom.parseXML(el)

    const parseElement = (elem) => {
      const endingTag = includes(headEndingTags, elem.tagName.toLowerCase())

      return {
        attributes: mapValues(dom.getAttributes(elem), val => decodeURIComponent(val)),
        children: endingTag ? null : compact(filter(toArray(elem.childNodes), child => child.tagName)).map(parseElement),
        content: endingTag ? removeCDATA($local(elem.tagName.toLowerCase()).html().trim()) : null,
        tagName: elem.tagName.toLowerCase()
      }
    }

    return parseElement(el)
  })
}

/**
 * Import an html document containing some mjml
 * returns JSON
 *   - container: the mjml container
 *   - mjml: a json representation of the mjml
 */
const documentParser = (content) => {
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
    throw new EmptyMJMLError('No root "<mjml>" or "<mj-body>" found in the file, or "<mj-body>" doesn\'t contain a child element.')
  }

  return {
    tagName: 'mjml',
    children: [{
      tagName: 'mj-head',
      children: head && head.length > 0 ? parseHead(head.get(0)) : []
    },
    {
      tagName: 'mj-body',
      children: [ mjmlElementParser(body, safeContent) ]
    }]
  }
}

export default documentParser
