const MJMLElements = {}
export const endingTags = []

export const registerElement = (tagName, element, options = {}) => {
  MJMLElements[tagName] = element

  if (options.endingTag) {
    endingTags.push(`mj-${tagName}`)
  }

  return true
}

export default MJMLElements
