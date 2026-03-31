import path from 'path'
import fs from 'fs'

export default function assertPathWithinRoot(resolvedPath, root) {
  let realRoot
  try {
    realRoot = fs.realpathSync(root)
  } catch (e) {
    realRoot = path.resolve(root)
  }

  let realResolved
  try {
    realResolved = fs.realpathSync(resolvedPath)
  } catch (e) {
    realResolved = path.resolve(resolvedPath)
  }

  const rootPrefix = realRoot + path.sep
  if (realResolved !== realRoot && !realResolved.startsWith(rootPrefix)) {
    throw new Error(
      'mj-include rejected: the included file path must be within the project directory',
    )
  }
}
