import kebabCase from 'lodash/kebabCase'

const components = {}

export function registerComponent(Component) {
  components[kebabCase(Component.name)] = Component
}

export function initComponent({ initialDatas, name }) {
  const Component = components[name]

  if (Component) {
    return new Component(initialDatas)
  }

  return null
}

export default components
