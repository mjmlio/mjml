import kebabCase from 'lodash/kebabCase'

const components = {}

export function registerComponent(Component) {
  components[kebabCase(Component.name)] = Component
}

export function initComponent({ initialDatas, name }) {
  const Component = components[name]

  if (Component) {
    console.log(name)
    const component = new Component(initialDatas)

    if (component.headStyle) {
      component.context.addHeadSyle(name, component.headStyle)
    }
    if (component.componentHeadStyle) {
      component.context.addComponentHeadSyle(component.componentHeadStyle)
    }

    return component
  }

  return null
}

export default components
