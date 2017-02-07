import _ from 'lodash'
import htmlparser from 'htmlparser2'

import parseAttributes, { decodeAttributes } from './helpers/parseAttributes'
import cleanNode from './helpers/cleanNode'
import convertBooleansOnAttrs from './helpers/convertBooleansOnAttrs'
import addCDATASection from './helpers/addCDATASection'
import setEmptyAttributes from './helpers/setEmptyAttributes'

export default function parseXML (xml, options = {}) {
  const {
    addEmptyAttributes = true,
    CDATASections = [],
    convertBooleans = true,
    globalAttributes = {},
    keepComments = true,
  } = options

  let safeXml = xml

  safeXml = parseAttributes(safeXml)
  safeXml = addCDATASection(CDATASections, safeXml)

  let mjml = null
  let cur = null

  const parser = new htmlparser.Parser({
    onopentag: (name, attrs) => {
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
    },
    onclosetag: () => {
      cur = (cur && cur.parent) || null
    },
    ontext: text => {
      if (!text) { return }

      const val = `${((cur && cur.content) || '')}${text}`.trim()

      if (val) {
        cur.content = decodeAttributes(val)
      }
    },
    oncomment: data => {
      if (cur && keepComments) {
        cur.children.push({
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
