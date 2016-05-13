export const registerMJHeadElement = (tagName, handler) => {
  MJMLHeadElementsCollection[tagName] = handler
}

const MJMLHeadElementsCollection = {}

export default MJMLHeadElementsCollection
