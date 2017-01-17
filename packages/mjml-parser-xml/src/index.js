import _ from 'lodash'
import expat from 'node-expat'

import parseAttributes from './helpers/parseAttributes'
import cleanNode from './helpers/cleanNode'
import convertBooleansOnAttrs from './helpers/convertBooleansOnAttrs'
import addCDATASection from './helpers/addCDATASection'
import setEmptyAttributes from './helpers/setEmptyAttributes'

export default function parseXML (xml, options = {}) {
  const {
    globalAttributes = {},
    CDATASections = [],
    addEmptyAttributes = true,
    convertBooleans = true,
  } = options

  let safeXml = parseAttributes(xml)
  safeXml = addCDATASection(CDATASections, safeXml)

  const parser = new expat.Parser('utf-8')

  let mjml = null
  let cur = null

  parser.on('startElement', (name, attrs) => {
    if (convertBooleans) {
      // "true" and "false" will be converted to bools
      attrs = convertBooleansOnAttrs(attrs)
    }

    attrs = _.mapValues(attrs, val => decodeURIComponent(val))

    const newNode = {
      parent: cur,
      tagName: name,
      attributes: attrs,
      children: [],
    }

    if (cur) {
      cur.children.push(newNode)
    } else {
      mjml = newNode
    }

    cur = newNode
  })

  parser.on('endElement', () => {
    cur = (cur && cur.parent) || null
  })

  parser.on('text', text => {
    if (!text) { return }

    const val = `${(cur.content || '')}${text}`.trim()

    if (val) {
      cur.content = val
    }
  })

  parser.on('error', err => { throw err })

  try {
    parser.write(safeXml)
  } catch (reason) {
    if (reason === 'mismatched tag') {
      if (cur) {
        throw new Error(`Tag ${cur.tagName} is not closed.`)
      }

      throw new Error('No correct tag found.')
    }

    throw new Error(reason)
  }

  if (!_.isObject(mjml)) {
    throw new Error('Parsing failed. Check your mjml.')
  }

  cleanNode(mjml)

  // Assign "attributes" property if not set
  if (addEmptyAttributes) {
    setEmptyAttributes(mjml)
  }

  return mjml
}
