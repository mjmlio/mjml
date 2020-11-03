export const assignDependencies = (target, ...sources) => {
  for (const source of sources) {
    for (const tag of Object.keys(source)) {
      const list = []
      if (target[tag]) {
        list.push(...target[tag])
      }
      if (source[tag]) {
        list.push(...source[tag])
      }
      target[tag] = Array.from(new Set(list))
    }
  }
  return target
}

const dependencies = {}

export const registerDependencies = (dep) => {
  assignDependencies(dependencies, dep)
}

export default dependencies
