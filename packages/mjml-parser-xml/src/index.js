import htmlparser from 'htmlparser2'

import isObject from 'lodash/isObject'
import findLastIndex from 'lodash/findLastIndex'
import find from 'lodash/find'
import mapValues from 'lodash/mapValues'
import path from 'path'
import fs from 'fs'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import flow from 'lodash/fp/flow'

import parseAttributes, { decodeAttributes } from './helpers/parseAttributes'
import cleanNode from './helpers/cleanNode'
import convertBooleansOnAttrs from './helpers/convertBooleansOnAttrs'
import addCDATASection from './helpers/addCDATASection'
import setEmptyAttributes from './helpers/setEmptyAttributes'

const indexesForNewLine = xml => {
  const regex = /\n/gi
  const indexes = [0]

  while (regex.exec(xml)) {
    indexes.push(regex.lastIndex)
  }

  return indexes
}

export default function MJMLParser(xml, options = {}, includedIn = []) {
  const {
    addEmptyAttributes = true,
    components = {},
    convertBooleans = true,
    keepComments = true,
    filePath = '.',
  } = options

  const CDATASections = flow(
    filter(component => component.endingTag),
    map(component => component.getTagName()),
  )({ ...components })

  const cwd = filePath ? path.dirname(filePath) : process.cwd()

  let safeXml = xml

  safeXml = parseAttributes(safeXml)
  safeXml = addCDATASection(CDATASections, safeXml)

  let mjml = null
  let cur = null
  let inInclude = !!includedIn.length

  const findTag = (tagName, tree) => find(tree.children, { tagName })
  const lineIndexes = indexesForNewLine(safeXml)

  const handleInclude = (file, line) => {
    const partialPath = path.resolve(cwd, file)

    if (find(cur.includedIn, {file: partialPath}))
      throw new Error(`Circular inclusion detected on file : ${partialPath}`)

    let content

    try {
      content = fs.readFileSync(partialPath, 'utf8')
    } catch (e) {
      const newNode = {
        line,
        file,
        absoluteFilePath: path.resolve(cwd, filePath),
        parent: cur,
        tagName: 'mj-raw',
        content: `<!-- mj-include fails to read file : ${file} at ${partialPath} -->`,
        children: [],
      }

      cur.children.push(newNode)
      cur = newNode

      return
    }

    content =
      content.indexOf('<mjml>') === -1
        ? `<mjml><mj-body>${content}</mj-body></mjml>`
        : content

    const partialMjml = MJMLParser(content,
      {
        ...options,
        filePath: partialPath,
      },
      [...cur.includedIn, {
        file: cur.absoluteFilePath,
        line
      }]
    )

    const bindToTree = (children, tree = cur) =>
      children.map(c => ({ ...c, parent: tree }))

    if (partialMjml.tagName !== 'mjml') {
      return
    }

    const body = findTag('mj-body', partialMjml)
    const head = findTag('mj-head', partialMjml)

    if (body) {
      cur.children = [...cur.children, ...bindToTree(body.children)]
    }

    if (head) {
      let curHead = findTag('mj-head', mjml)

      if (!curHead) {
        mjml.children.push({
          file: filePath,
          absoluteFilePath: path.resolve(cwd, filePath),
          parent: mjml,
          tagName: 'mj-head',
          children: [],
        })

        curHead = findTag('mj-head', mjml)
      }

      curHead.children = [
        ...curHead.children,
        ...bindToTree(head.children, curHead),
      ]
    }
  }

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attrs) => {
        // eslint-disable-line consistent-return
        const line = findLastIndex(lineIndexes, i => i <= parser.startIndex) + 1

        if (name === 'mj-include') {
          inInclude = true
          return handleInclude(decodeURIComponent(attrs.path), line)
        }

        if (convertBooleans) {
          // "true" and "false" will be converted to bools
          attrs = convertBooleansOnAttrs(attrs)
        }

        attrs = mapValues(attrs, val => decodeURIComponent(val))

        const newNode = {
          file: filePath,
          absoluteFilePath: path.resolve(cwd, filePath),
          line,
          includedIn,
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
        if (inInclude) {
          inInclude = false
          return
        }

        cur = (cur && cur.parent) || null
      },
      ontext: text => {
        if (!text) {
          return
        }

        const val = `${(cur && cur.content) || ''}${text}`.trim()

        if (val) {
          cur.content = decodeAttributes(val)
        }
      },
      oncomment: data => {
        if (cur && keepComments) {
          cur.children.push({
            line: findLastIndex(lineIndexes, i => i <= parser.startIndex) + 1,
            tagName: 'mj-raw',
            content: `<!-- ${data.trim()} -->`,
          })
        }
      },
    },
    {
      xmlMode: true,
    },
  )

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
