import fs from 'fs'
import nodePath from 'path'
import { sync } from 'glob'
import { flatMap } from 'lodash'
import { assertPathWithinRoot } from 'mjml-parser-xml'

export const flatMapPaths = (paths) =>
  flatMap(paths, (p) => sync(p, { nodir: true }))

export default (filePath) => {
  assertPathWithinRoot(nodePath.resolve(filePath), process.cwd())

  try {
    return { file: filePath, mjml: fs.readFileSync(filePath).toString() }
  } catch (e) {
    // eslint-disable-next-line
    console.warn(`Cannot read file: ${filePath} doesn't exist or no access`, e)
    return {}
  }
}
