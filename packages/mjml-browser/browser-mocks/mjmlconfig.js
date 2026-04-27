/* eslint-disable no-unused-vars */
/* Browser-safe stub for mjml-core helpers/mjmlconfig */
import { registerComponent } from '../../mjml-core/lib/components'

export function readMjmlConfig(configPathOrDir = '.') {
  return {
    mjmlConfig: { packages: [], options: {} },
    componentRootPath: '.',
  }
}

export function resolveComponentPath(compPath, componentRootPath) {
  return null
}

export function registerCustomComponent(comp, registerCompFn = registerComponent) {
  if (comp instanceof Function) {
    registerCompFn(comp)
  } else if (comp && typeof comp === 'object') {
    Object.keys(comp).forEach((name) => registerCustomComponent(comp[name], registerCompFn))
  }
}

export function handleMjmlConfigComponents(packages, componentRootPath, registerCompFn) {
  return { success: [], failures: [] }
}

export default function handleMjmlConfig(configPathOrDir = '.', registerCompFn = registerComponent) {
  const { mjmlConfig: { packages }, componentRootPath } = readMjmlConfig(configPathOrDir)
  return handleMjmlConfigComponents(packages, componentRootPath, registerCompFn)
}
