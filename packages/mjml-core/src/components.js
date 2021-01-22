import { kebabCase } from 'lodash'

const components = {}

export function registerComponent(Component) {
  components[Component.componentName || kebabCase(Component.name)] = Component
}

export default components
