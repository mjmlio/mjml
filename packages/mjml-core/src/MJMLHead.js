import { includes } from 'lodash'

export const endingTags = []
export const registerMJHeadElement = (...args) => {
  let name, endingTag, handler // eslint-disable-line

  if (args.length > 1) {
    [name, handler, endingTag] = args
  } else {
    ({ name, handler, endingTag } = args[0])
  }

  endingTag  && !includes(endingTags, name) && endingTags.push(name)

  MJMLHeadElementsCollection[name] = handler
}

const MJMLHeadElementsCollection = {}

export default MJMLHeadElementsCollection
