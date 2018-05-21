import path from 'path'
import fs from 'fs'

import { registerComponent } from '../components'

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


export function resolveComponentPath(compPath, componentRootPath) {
  if (!compPath) {
    return null
  }
  if (!compPath.startsWith('.') && !path.isAbsolute(compPath)) {
    try {
      return require.resolve(compPath)
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        console.log('Error resolving custom component path : ', e) // eslint-disable-line no-console
        return null
      }
      // we got a 'MODULE_NOT_FOUND' error
      try {
        // try again as relative path to node_modules: (this may be necessary if mjml is intalled globally or by npm link)
        return resolveComponentPath(`./node_modules/${compPath}`, componentRootPath)
      } catch (e) {
        //  try again as a plain local path:
        return resolveComponentPath(`./${compPath}`, componentRootPath)
      }
    }
  }
  return require.resolve(path.resolve(componentRootPath, compPath))
}

export function registerCustomComponent(comp, registerCompFn = registerComponent) {
  if (comp instanceof Function) {
    registerCompFn(comp)
  } else {
    const compNames = Object.keys(comp) // this approach handles both an array and an object (like the mjml-accordion default export)
    compNames.forEach(compName => {
      registerCustomComponent(comp[compName], registerCompFn)
    })
  }
}

export default function registerCustomComponents(configPathOrDir = process.cwd(), registerCompFn = registerComponent) {
  const { mjmlConfig: { packages }, componentRootPath } = readMjmlConfig(configPathOrDir)
  packages.forEach(compPath => {
    let resolvedPath = compPath
    try {
      resolvedPath = resolveComponentPath(compPath, componentRootPath)
      if (resolvedPath) {
        const requiredComp = require(resolvedPath) // eslint-disable-line global-require, import/no-dynamic-require
        registerCustomComponent(requiredComp.default || requiredComp, registerCompFn)
      }
    } catch (e) {
      if (e.code === 'ENOENT' || e.code !== 'MODULE_NOT_FOUND') {
        console.log('Missing or unreadable custom component : ', resolvedPath) // eslint-disable-line no-console
      } else {
        console.log('Error when registering custom component : ', resolvedPath, e) // eslint-disable-line no-console
      }
    }
  })
}