import warning from 'warning'

export const endingTags = []
export const postRenders = []
export const mjCssClasses = {}
export const mjDefaultAttributes = {}

export const resetCssClassesAndDefaultAttributes = () => {
  //mjCssClasses = {}
  //mjDefaultAttributes = {}
}

export const setMjCssClasses = (mjClass, attributes) => {
  mjCssClasses[mjClass] = attributes
}

export const setMjDefaultAttributes = (tagName, attributes) => {
  console.log('register:', tagName, attributes)
  mjDefaultAttributes[tagName] = attributes
}

export const registerMJElement = Component => {
  const { endingTag, postRender, tagName } = Component

  if (!tagName) {
    return warning(false, 'Component has no TagName')
  }

  endingTag  && endingTags.push(tagName)
  postRender && postRenders.push(postRender)

  MJMLElementsCollection[tagName] = Component
}

const MJMLElementsCollection = {}

export default MJMLElementsCollection
