import htmlparser from 'htmlparser2'

import { isObject, findLastIndex, find } from 'lodash'
import { filter, map, flow } from 'lodash/fp'
import path from 'path'
import fs from 'fs'

import cleanNode from './helpers/cleanNode'
import convertBooleansOnAttrs from './helpers/convertBooleansOnAttrs'
import setEmptyAttributes from './helpers/setEmptyAttributes'

const indexesForNewLine = (xml) => {
  const regex = /\n/gi
  const indexes = [0]

  while (regex.exec(xml)) {
    indexes.push(regex.lastIndex)
  }

  return indexes
}

const isSelfClosing = (indexes, parser) =>
  indexes.startIndex === parser.startIndex &&
  indexes.endIndex === parser.endIndex

export default function MJMLParser(xml, options = {}, includedIn = []) {
  const {
    addEmptyAttributes = true,
    components = {},
    convertBooleans = true,
    keepComments = true,
    filePath = '.',
    actualPath = '.',
    ignoreIncludes = false,
    preprocessors = [],
  } = options

  const endingTags = flow(
    filter((component) => component.endingTag),
    map((component) => component.getTagName()),
  )({ ...components })

  let cwd = process.cwd()

  if (filePath) {
    try {
      const isDir = fs.lstatSync(filePath).isDirectory()
      cwd = isDir ? filePath : path.dirname(filePath)
    } catch (e) {
      throw new Error('Specified filePath does not exist')
    }
  }

  let mjml = null
  let cur = null
  let inInclude = !!includedIn.length
  let inEndingTag = 0
  const currentEndingTagIndexes = { startIndex: 0, endIndex: 0 }

  const findTag = (tagName, tree) => find(tree.children, { tagName })
  const lineIndexes = indexesForNewLine(xml)

  const handleInclude = (file, line) => {
    const partialPath = path.resolve(cwd, file)
    const curBeforeInclude = cur

    if (find(cur.includedIn, { file: partialPath }))
      throw new Error(`Circular inclusion detected on file : ${partialPath}`)

    let content

    try {
      content = fs.readFileSync(partialPath, 'utf8')
    } catch (e) {
      const newNode = {
        line,
        file,
        absoluteFilePath: path.resolve(cwd, actualPath),
        parent: cur,
        tagName: 'mj-raw',
        content: `<!-- mj-include fails to read file : ${file} at ${partialPath} -->`,
        children: [],
        errors: [
          {
            type: 'include',
            params: { file, partialPath },
          },
        ],
      }
      cur.children.push(newNode)

      return
    }

    content =
      content.indexOf('<mjml>') === -1
        ? `<mjml><mj-body>${content}</mj-body></mjml>`
        : content

    const partialMjml = MJMLParser(
      content,
      {
        ...options,
        filePath: partialPath,
        actualPath: partialPath,
      },
      [
        ...cur.includedIn,
        {
          file: cur.absoluteFilePath,
          line,
        },
      ],
    )

    const bindToTree = (children, tree = cur) =>
      children.map((c) => ({ ...c, parent: tree }))

    if (partialMjml.tagName !== 'mjml') {
      return
    }

    const body = findTag('mj-body', partialMjml)
    const head = findTag('mj-head', partialMjml)

    if (body) {
      const boundChildren = bindToTree(body.children)
      cur.children = [...cur.children, ...boundChildren]
    }

    if (head) {
      let curHead = findTag('mj-head', mjml)

      if (!curHead) {
        mjml.children.push({
          file: actualPath,
          absoluteFilePath: path.resolve(cwd, actualPath),
          parent: mjml,
          tagName: 'mj-head',
          children: [],
          includedIn: [],
        })

        curHead = findTag('mj-head', mjml)
      }

      const boundChildren = bindToTree(head.children, curHead)
      curHead.children = [...curHead.children, ...boundChildren]
    }

    // must restore cur to the cur before include started
    cur = curBeforeInclude
  }

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attrs) => {
        const isAnEndingTag = endingTags.indexOf(name) !== -1

        if (inEndingTag > 0) {
          if (isAnEndingTag) inEndingTag += 1
          return
        }

        if (isAnEndingTag) {
          inEndingTag += 1

          if (inEndingTag === 1) {
            // we're entering endingTag
            currentEndingTagIndexes.startIndex = parser.startIndex
            currentEndingTagIndexes.endIndex = parser.endIndex
          }
        }

        const line =
          findLastIndex(lineIndexes, (i) => i <= parser.startIndex) + 1

        if (name === 'mj-include') {
          if (ignoreIncludes) return

          inInclude = true
          handleInclude(decodeURIComponent(attrs.path), line)
          return
        }

        if (convertBooleans) {
          // "true" and "false" will be converted to bools
          attrs = convertBooleansOnAttrs(attrs)
        }

        const newNode = {
          file: actualPath,
          absoluteFilePath: path.resolve(cwd, actualPath),
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
      onclosetag: (name) => {
        if (endingTags.indexOf(name) !== -1) {
          inEndingTag -= 1

          if (!inEndingTag) {
            // we're getting out of endingTag
            // if self-closing tag we don't get the content
            if (!isSelfClosing(currentEndingTagIndexes, parser)) {
              const partialVal = xml
                .substring(
                  currentEndingTagIndexes.endIndex + 1,
                  parser.endIndex,
                )
                .trim()
              const val = partialVal.substring(
                0,
                partialVal.lastIndexOf(`</${name}`),
              )

              if (val) cur.content = val.trim()
            }
          }
        }

        if (inEndingTag > 0) return

        if (inInclude) {
          inInclude = false
        }

        // for includes, setting cur is handled in handleInclude because when there is
        // only mj-head in include it doesn't create any elements, so setting back to parent is wrong
        if (name !== 'mj-include') cur = (cur && cur.parent) || null
      },
      ontext: (text) => {
        if (inEndingTag > 0) return

        if (text && text.trim() && cur) {
          cur.content = `${(cur && cur.content) || ''}${text.trim()}`.trim()
        }
      },
      oncomment: (data) => {
        if (inEndingTag > 0) return

        if (cur && keepComments) {
          cur.children.push({
            line: findLastIndex(lineIndexes, (i) => i <= parser.startIndex) + 1,
            tagName: 'mj-raw',
            content: `<!-- ${data.trim()} -->`,
            includedIn,
          })
        }
      },
    },
    {
      recognizeCDATA: true,
      decodeEntities: false,
      recognizeSelfClosing: true,
      lowerCaseAttributeNames: false,
    },
  )

  // Apply preprocessors to raw xml
  xml = flow(preprocessors)(xml)

  parser.write(xml)
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
