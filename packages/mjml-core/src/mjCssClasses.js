let mjCssClasses = {}

export const setMjCssClasses = (mjClass, attributes) => {
  mjCssClasses[mjClass] = attributes
}

export const resetCssClasses = () => {
  mjCssClasses = {}
}

export default mjCssClasses
