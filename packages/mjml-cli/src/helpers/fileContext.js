import { mjIncludeRegexp } from 'mjml-core'
import fs from 'fs'
import path from 'path'

const ensureMJMLFile = file => file.trim().match(/.mjml/) && file || `${file}.mjml`
const error = e => console.log(e.stack || e) // eslint-disable-line no-console

export default (baseFile) => {
  const filesIncluded = [path.resolve(baseFile)]

  const readIncludes = (dir, file, base) => {
    const currentFile = path.resolve(path.join(dir, ensureMJMLFile(file)))
    const currentDirectory = path.dirname(currentFile)
    const includeRegexp = new RegExp(mjIncludeRegexp)

    let content
    try {
      content = fs.readFileSync(currentFile, 'utf8')
    } catch (e) {
      error(`File not found ${currentFile} from ${base}`)
      return;
    }

    let matchgroup = includeRegexp.exec(content)
    while (matchgroup != null) {
      const includedFile = ensureMJMLFile(matchgroup[1])
      const includedFilePath = path.resolve(path.join(currentDirectory, includedFile))

      filesIncluded.push(includedFilePath)

      readIncludes(path.dirname(currentFile), includedFile, currentFile)
      matchgroup = includeRegexp.exec(content)
    }
  }

  readIncludes('.', baseFile, baseFile)

  return filesIncluded
}
