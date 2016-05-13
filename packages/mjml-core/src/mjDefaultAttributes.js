const mjDefaultAttributes = {}

export const setMjDefaultAttributes = (tagName, attributes) => {
  mjDefaultAttributes[tagName] = attributes
  console.log('register', tagName, attributes, mjDefaultAttributes)
}

export const resetDefaultAttributes = () => {
  //mjDefaultAttributes = {}
}

export default mjDefaultAttributes
