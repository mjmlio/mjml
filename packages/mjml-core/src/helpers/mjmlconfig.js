import path from 'path'
import fs from 'fs'

import { registerComponent } from '../components'

export function resolveComponentPath(compPath, componentRootPath) {
  if (!compPath) {
    return null
  } else if (compPath.startsWith('.') || path.isAbsolute(compPath)) {
    return path.resolve(componentRootPath, compPath)
  }
  return require.resolve(compPath)
}

export function readMjmlConfig(configPathOrDir = process.cwd()) {
  let componentRootPath = process.cwd()
  let mjmlConfigPath = configPathOrDir
  try {
    mjmlConfigPath = path.basename(configPathOrDir) === '.mjmlconfig'
      ? path.resolve(configPathOrDir)
      : path.resolve(configPathOrDir, '.mjmlconfig')
    componentRootPath = path.dirname(mjmlConfigPath)
    const mjmlConfig = JSON.parse(fs.readFileSync(path.resolve(mjmlConfigPath), 'utf8'))
    return { mjmlConfig, componentRootPath }
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.log('Error reading mjmlconfig : ', e) // eslint-disable-line no-console
    }
    return { mjmlConfig: { packages: [] }, mjmlConfigPath, componentRootPath }
  }
}

export default function registerCustomComponents(configPathOrDir = process.cwd(), registerCompFn = registerComponent) {
  const { mjmlConfig: { packages }, componentRootPath } = readMjmlConfig(configPathOrDir)
  packages.forEach(compPath => {
    const resolvedPath = resolveComponentPath(compPath, componentRootPath)
    if (resolvedPath) {
      try {
        const requiredComp = require(resolvedPath) // eslint-disable-line global-require, import/no-dynamic-require
        registerCompFn(requiredComp.default || requiredComp)
      } catch (e) {
        if (e.code !== 'ENOENT') {
          console.log('Error when registering custom component : ', resolvedPath, e) // eslint-disable-line no-console
        } else {
          console.log('Missing or unreadable custom component : ', resolvedPath) // eslint-disable-line no-console
        }
      }
    }
  })
}