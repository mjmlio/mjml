import { kebabCase } from 'lodash'

const components = {}

export function assignComponents(target, source) {
  for (const component of source) {
    target[component.componentName || kebabCase(component.name)] = component
  }
}

export function registerComponent(Component) {
  assignComponents(components, [Component])
}

export default components
