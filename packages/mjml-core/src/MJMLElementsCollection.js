import warning from 'warning'

export const endingTags = []
export const postRenders = []
export const schemaXsds = []

export const registerMJElement = Component => {
  const { endingTag, postRender, tagName, schemaXsd } = Component

  if (!tagName) {
    return warning(false, 'Component has no TagName')
  }

  endingTag  && endingTags.push(tagName)
  postRender && postRenders.push(postRender)
  schemaXsd  && schemaXsds.push(schemaXsd)

  MJMLElementsCollection[tagName] = Component
}

const MJMLElementsCollection = {}

export default MJMLElementsCollection
