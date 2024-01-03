import { kebabCase } from 'lodash'
import { registerDependencies } from 'mjml-validator'

const components = {}

export function assignComponents(target, source) {
  for (const component of source) {
    target[component.componentName || kebabCase(component.name)] = component
  }
}

export function registerComponent(Component, options = {}) {
  assignComponents(components, [Component])

  if (Component.dependencies && options.registerDependencies) {
    registerDependencies(Component.dependencies)
  }
}

export default components
