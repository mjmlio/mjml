import _map from "lodash/map"

const mjCssClasses = {}

export const setMjCssClasses = (mjClass, attributes) => {
  mjCssClasses[mjClass] = attributes
}

export const resetCssClasses = () => {
  _map(mjCssClasses, (v, k) => delete mjCssClasses[k])
}

export default mjCssClasses
