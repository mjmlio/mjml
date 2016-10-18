import warning from 'warning'
import { includes } from 'lodash'

export const endingTags = []
export const postRenders = []

export const registerMJElement = Component => {
  const { endingTag, postRender, tagName } = Component

  if (!tagName) {
    return warning(false, 'Component has no tagName')
  }

  endingTag  && !includes(endingTags, tagName) && endingTags.push(tagName)
  postRender && postRenders.push(postRender)

  MJMLElementsCollection[tagName] = Component
}

const MJMLElementsCollection = {}

export default MJMLElementsCollection
