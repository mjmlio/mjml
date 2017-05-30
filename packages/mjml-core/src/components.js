import flatMap from 'lodash/flatMap'
import merge from 'lodash/merge'

const components = {
}

export function registerComponent (component) {
  components[component.getName()] = component
}

export function initComponent ({ initialDatas, name }) {
  const component = components[name]

  if (component) {
    return new component(initialDatas)
  }

  return null
}

export default components
