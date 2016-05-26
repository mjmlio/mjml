let mjDefaultAttributes = {}

export const setMjDefaultAttributes = (tagName, attributes) => {
  mjDefaultAttributes[tagName] = attributes
}

export const resetDefaultAttributes = () => {
  mjDefaultAttributes = {}
}

export default mjDefaultAttributes
