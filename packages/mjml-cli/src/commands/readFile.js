import fs from 'fs'
import glob from 'glob'
import { flatMap } from 'lodash'

export const flatMapPaths = (paths) =>
  flatMap(paths, (p) => glob.sync(p, { nodir: true }))

export default (path) => {
  try {
    return { file: path, mjml: fs.readFileSync(path).toString() }
  } catch (e) {
    // eslint-disable-next-line
    console.warn(`Cannot read file: ${path} doesn't exist or no access`, e)
    return {}
  }
}
