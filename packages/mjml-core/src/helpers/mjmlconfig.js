import path from 'path'
import fs from 'fs'
import { registerDependencies } from 'mjml-validator'

import { registerComponent } from '../components'

export function readMjmlConfig(configPathOrDir = process.cwd()) {
  let componentRootPath = process.cwd()
  let mjmlConfigPath = configPathOrDir
  try {
    mjmlConfigPath =
      path.basename(configPathOrDir).match(/^\.mjmlconfig(\.js)?$/)
        ? path.resolve(configPathOrDir)
        : path.resolve(configPathOrDir, '.mjmlconfig')
    componentRootPath = path.dirname(mjmlConfigPath)
    
    const fullPath = path.resolve(mjmlConfigPath)

    let mjmlConfig
    if (path.extname(mjmlConfigPath) === '.js') {
      delete require.cache[fullPath]
      mjmlConfig = require(fullPath) // eslint-disable-line global-require, import/no-dynamic-require
    } else {
      mjmlConfig = JSON.parse(
        fs.readFileSync(fullPath, 'utf8'),
      )
    }

    return { mjmlConfig, componentRootPath }
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error('Error reading mjmlconfig : ', e) // eslint-disable-line no-console
    }
    return {
      mjmlConfig: { packages: [], options: {} },
      mjmlConfigPath,
      componentRootPath,
      error: e,
    }
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
        console.error('Error resolving custom component path : ', e) // eslint-disable-line no-console
        return null
      }
      // we got a 'MODULE_NOT_FOUND' error
      try {
        // try again as relative path to node_modules: (this may be necessary if mjml is installed globally or by npm link)
        return resolveComponentPath(
          `./node_modules/${compPath}`,
          componentRootPath,
        )
      } catch (e) {
        //  try again as a plain local path:
        return resolveComponentPath(`./${compPath}`, componentRootPath)
      }
    }
  }
  return require.resolve(path.resolve(componentRootPath, compPath))
}

export function registerCustomComponent(
  comp,
  registerCompFn = registerComponent,
) {
  if (comp instanceof Function) {
    registerCompFn(comp)
  } else {
    const compNames = Object.keys(comp) // this approach handles both an array and an object (like the mjml-accordion default export)
    compNames.forEach((compName) => {
      registerCustomComponent(comp[compName], registerCompFn)
    })
  }
}

export function handleMjmlConfigComponents(
  packages,
  componentRootPath,
  registerCompFn,
) {
  const result = {
    success: [],
    failures: [],
  }

  packages.forEach((compPath) => {
    let resolvedPath = compPath
    try {
      resolvedPath = resolveComponentPath(compPath, componentRootPath)
      if (resolvedPath) {
        const requiredComp = require(resolvedPath) // eslint-disable-line global-require, import/no-dynamic-require
        registerCustomComponent(
          requiredComp.default || requiredComp,
          registerCompFn,
        )
        registerDependencies(
          (requiredComp.default || requiredComp).dependencies || {},
        )
        result.success.push(compPath)
      }
    } catch (e) {
      result.failures.push({ error: e, compPath })
      if (e.code === 'ENOENT' || e.code === 'MODULE_NOT_FOUND') {
        console.error('Missing or unreadable custom component : ', resolvedPath) // eslint-disable-line no-console
      } else {
        // eslint-disable-next-line no-console
        console.error(
          'Error when registering custom component : ',
          resolvedPath,
          e,
        )
      }
    }
  })

  return result
}

export default function handleMjmlConfig(
  configPathOrDir = process.cwd(),
  registerCompFn = registerComponent,
) {
  const {
    mjmlConfig: { packages },
    componentRootPath,
    error,
  } = readMjmlConfig(configPathOrDir)
  if (error) return { error }

  return handleMjmlConfigComponents(packages, componentRootPath, registerCompFn)
}
