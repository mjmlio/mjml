import warning from 'warning'
import defaultXsd from './helpers/xsd'

export const endingTags = []
export const postRenders = []
export const schemaXsds = []

export const registerMJElement = Component => {
  const { endingTag, postRender, tagName, schemaXsd } = Component

  if (!tagName) {
    return warning(false, 'Component has no tagName')
  }

  endingTag  === true  && endingTags.push(tagName)

  postRender && postRenders.push(postRender)
  schemaXsds.push(schemaXsd || defaultXsd(Component))

  MJMLElementsCollection[tagName] = Component
}

const MJMLElementsCollection = {}

export default MJMLElementsCollection
