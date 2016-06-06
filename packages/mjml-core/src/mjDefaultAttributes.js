import _map from "lodash/map"

const mjDefaultAttributes = {}

export const setMjDefaultAttributes = (tagName, attributes) => {
  mjDefaultAttributes[tagName] = attributes
}

export const resetDefaultAttributes = () => {
  _map(mjDefaultAttributes, (v, k) => delete mjDefaultAttributes[k])
}

export default mjDefaultAttributes
