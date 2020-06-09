import fs from 'fs'
import path from 'path'

const includeRegexp = /<mj-include\s+path=['"](.*[.mjml]?)['"]\s*(\/>|>\s*<\/mj-include>)/g

const ensureIncludeIsMJMLFile = (file) =>
  (file.trim().match(/.mjml/) && file) || `${file}.mjml`
const error = (e) => console.error(e.stack || e) // eslint-disable-line no-console

export default (baseFile, filePath) => {
  const filesIncluded = []

  let filePathDirectory = ''
  if (filePath) {
    try {
      const isFilePathDir = fs.lstatSync(filePath).isDirectory()

      filePathDirectory = isFilePathDir ? filePath : path.dirname(filePath)
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new Error('Specified filePath does not exist')
      } else {
        throw e
      }
    }
  }

  const readIncludes = (dir, file, base) => {
    const currentFile = path.resolve(
      dir
        ? path.join(dir, ensureIncludeIsMJMLFile(file))
        : ensureIncludeIsMJMLFile(file),
    )

    const currentDirectory = path.dirname(currentFile)

    const includes = new RegExp(includeRegexp)

    let content
    try {
      content = fs.readFileSync(currentFile, 'utf8')
    } catch (e) {
      error(`File not found ${currentFile} from ${base}`)
      return
    }

    let matchgroup = includes.exec(content)
    while (matchgroup != null) {
      const includedFile = ensureIncludeIsMJMLFile(matchgroup[1])

      // when reading first level of includes we must join the path specified in filePath
      // when reading further nested includes, just take parent dir as base
      const targetDir =
        filePath && file === baseFile ? filePathDirectory : currentDirectory

      const includedFilePath = path.resolve(path.join(targetDir, includedFile))

      filesIncluded.push(includedFilePath)

      readIncludes(targetDir, includedFile, currentFile)
      matchgroup = includes.exec(content)
    }
  }

  readIncludes(null, baseFile, baseFile)

  return filesIncluded
}
