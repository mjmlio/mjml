export const mergeDependencies = (left, right) => {
  const allTags = Array.from(
    new Set([...Object.keys(left), ...Object.keys(right)]),
  )
  const newDependencies = {}
  for (const tag of allTags) {
    const list = []
    if (left[tag]) {
      list.push(...left[tag])
    }
    if (right[tag]) {
      list.push(...right[tag])
    }
    newDependencies[tag] = Array.from(new Set(list))
  }
  return newDependencies
}

const dependencies = {}

export const registerDependencies = (dep) => {
  dependencies = mergeDependencies(dependencies, dep)
}

export default dependencies
