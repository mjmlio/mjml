import _ from 'lodash'
import htmlparser from 'htmlparser2'

import isObject from 'lodash/isObject'
import findLastIndex from 'lodash/findLastIndex'
import mapValues from 'lodash/mapValues'

import parseAttributes, { decodeAttributes } from './helpers/parseAttributes'
import cleanNode from './helpers/cleanNode'
import convertBooleansOnAttrs from './helpers/convertBooleansOnAttrs'
import addCDATASection from './helpers/addCDATASection'
import setEmptyAttributes from './helpers/setEmptyAttributes'

const indexesForNewLine = (xml) => {
  const regex = /\n/gi
  const indexes = [0]

  while (regex.exec(xml)) {
    indexes.push(regex.lastIndex)
  }

  return indexes
}

export default function MJMLParser(xml, options = {}) {
  const {
    addEmptyAttributes = true,
    components = {},
    convertBooleans = true,
    keepComments = true,
  } = options

  const CDATASections = _.chain({
    ...components,
  })
  .filter(component => component.prototype.endingTag)
  .map(component => component.tagName)
  .value()

  let safeXml = xml

  safeXml = parseAttributes(safeXml)
  safeXml = addCDATASection(CDATASections, safeXml)

  let mjml = null
  let cur = null

  const lineIndexes = indexesForNewLine(safeXml)

  const parser = new htmlparser.Parser({
    onopentag: (name, attrs) => {
      const line = findLastIndex(lineIndexes, i => i <= parser.startIndex) + 1

      if (convertBooleans) {
        // "true" and "false" will be converted to bools
        attrs = convertBooleansOnAttrs(attrs)
      }

      attrs = mapValues(attrs, val => decodeURIComponent(val))

      const newNode = {
        line,
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
    },
    onclosetag: () => {
      cur = (cur && cur.parent) || null
    },
    ontext: (text) => {
      if (!text) { return }

      const val = `${((cur && cur.content) || '')}${text}`.trim()

      if (val) {
        cur.content = decodeAttributes(val)
      }
    },
    oncomment: (data) => {
      if (cur && keepComments) {
        cur.children.push({
          line: findLastIndex(lineIndexes, i => i <= parser.startIndex) + 1,
          tagName: 'mj-raw',
          content: `<!-- ${data.trim()} -->`,
        })
      }
    },
  }, {
    xmlMode: true,
  })

  parser.write(safeXml)
  parser.end()

  if (!isObject(mjml)) {
    throw new Error('Parsing failed. Check your mjml.')
  }

  cleanNode(mjml)

  // Assign "attributes" property if not set
  if (addEmptyAttributes) {
    setEmptyAttributes(mjml)
  }

  return mjml
}
