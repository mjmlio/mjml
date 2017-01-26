import fs from 'fs'
import path from 'path'

export const includes = /<mj-include\s+path=['"](.*[\.mjml]?)['"]\s*(\/>|>\s*<\/mj-include>)/g

const getBodyContent = input => (/<mj-container[^>]*>([\s\S]*?)<\/mj-container>/.exec(input) || [])[1]
const getHeadContent = input => (/<mj-head[^>]*>([\s\S]*?)<\/mj-head>/.exec(input) || [])[1]
const ensureMJMLFile = file => file.trim().match(/.mjml/) && file || `${file}.mjml`
const parseDocument = input => {
  const internals = { content: getBodyContent(input), head: getHeadContent(input) }

  // Neither mj-container or mj-head inside the document
  // So we assume that entire file is a just plain MJML content
  if (!internals.content && !internals.head) {
    internals.content = input
  }

  return internals
}

const replaceContent = (currentDir, headStack, _, fileName) => {
  const filePath = path.normalize(path.join(currentDir, ensureMJMLFile(fileName)))
  let partial

  try {
    partial = fs.readFileSync(filePath, 'utf8')
  } catch (e) {
    return `<mj-raw><!-- mj-include: file not found ${filePath} --></mj-raw>`
  }

  let { content, head } = parseDocument(partial) // eslint-disable-line prefer-const

  if (!content && !head) { throw new Error(`Error while reading file: ${filePath}, file has no content ?`) }

  if (head) {
    headStack.push(head)
  }

  if (content) {
    content = content.replace(includes, replaceContent.bind(this, path.resolve(path.dirname(filePath)), headStack))
  }

  return content
}

export default (baseMjml, { filePath }) => {
  const headStack = []
  let mjml = baseMjml
  const fileDir = filePath ? path.dirname(filePath) : process.cwd()
  mjml = mjml.replace(includes, replaceContent.bind(this, path.resolve(fileDir), headStack))

  if (headStack.length > 0) {
    if (mjml.indexOf('<mj-head>') == -1) {
      mjml = mjml.replace('<mjml>', '<mjml>\n  <mj-head>\n  </mj-head>\n')
    }

    mjml = mjml.replace('</mj-head>', `${headStack.join('\n')}\n</mj-head>`)
  }

  return mjml
}
