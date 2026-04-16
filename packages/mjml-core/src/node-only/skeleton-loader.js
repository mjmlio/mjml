export default function loadSkeleton(sk) {
  // eslint-disable-next-line global-require
  const path = require('path')
  const resolved = path.isAbsolute(sk) ? sk : path.resolve(process.cwd(), sk)
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(resolved)
}
