import interopDefault from '../helpers/interopDefault'

export default function loadSkeleton(sk) {
  // eslint-disable-next-line global-require
  const path = require('path')
  const resolved = path.isAbsolute(sk) ? sk : path.resolve(process.cwd(), sk)
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return interopDefault(require(resolved))
  } catch (e) {
    // Node 26 loads extensionless files under "type": "module" as ESM
    if (e instanceof ReferenceError && /ES module scope/.test(e.message)) {
      e.message = `Skeleton "${resolved}" was loaded as an ES module (the nearest package.json has "type": "module"). Use \`export default\` or rename it to \`.cjs\`. ${e.message}`
    }
    throw e
  }
}
