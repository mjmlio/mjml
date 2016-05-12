export const registerMJHeadElement = (tagName, handler) => {
  MJMLHeadElementsCollection[tagName] = handler

  console.log(MJMLHeadElementsCollection)
}

const MJMLHeadElementsCollection = {}

export default MJMLHeadElementsCollection
