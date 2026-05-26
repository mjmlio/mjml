import fs from 'fs'
import path from 'path'

const includeRegexp =
  /<mj-include[^<>]+path=['"](.*(?:\.mjml|\.css|\.html))['"]\s*[^<>]*(\/>|>\s*<\/mj-include>)/gi

const ensureIncludeIsSupportedFile = (file) =>
  path.extname(file).match(/\.mjml|\.css|\.html/) ? file : `${file}.mjml`

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
        ? path.join(dir, ensureIncludeIsSupportedFile(file))
        : ensureIncludeIsSupportedFile(file),
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
      const includedFile = ensureIncludeIsSupportedFile(matchgroup[1])

      // when reading first level of includes we must join the path specified in filePath
      // when reading further nested includes, just take parent dir as base
      const targetDir =
        filePath && file === baseFile ? filePathDirectory : currentDirectory

      const includedFilePath = path.resolve(path.join(targetDir, includedFile))

      // Resolve symlinks to their real paths so chokidar's followSymlinks behavior
      // matches our dependency tracking (chokidar reports changes on real paths)
      let realPath = includedFilePath
      try {
        realPath = fs.realpathSync(includedFilePath)
      } catch (e) {
        // If realpathSync fails (file doesn't exist yet), use the resolved path as-is
      }
      filesIncluded.push(realPath)

      readIncludes(targetDir, includedFile, currentFile)
      matchgroup = includes.exec(content)
    }
  }

  readIncludes(null, baseFile, baseFile)

  return filesIncluded
}
