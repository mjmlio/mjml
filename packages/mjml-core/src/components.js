const components = {
  head: {},
  body: {},
}

export function registerComponent (component) {
  components[component.getType()][component.getName()] = component
}

export function initComponent ({ initialDatas, name, type = 'body' }) {
  const component = components[type][name]

  if (component) {
    return new component(initialDatas)
  }

  return null
}

export default components
