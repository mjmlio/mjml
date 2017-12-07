import kebabCase from 'lodash/kebabCase'

const components = {}

export function registerComponent(Component) {
  components[kebabCase(Component.name)] = Component
}

export function initComponent({ initialDatas, name }) {
  const Component = components[name]

  if (Component) {
    const component = new Component(initialDatas)

    if (Component.headStyle) {
      component.context.addHeadSyle(name, Component.headStyle)
    }

    return component
  }

  return null
}

export default components
