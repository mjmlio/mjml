import ruleError from './ruleError'

export default function errorAttr(element) {
  const { errors } = element

  if (!errors) return null

  return errors.map((error) => {
    switch (error.type) {
      case 'include': {
        const { file, partialPath } = error.params

        return ruleError(
          `mj-include fails to read file : ${file} at ${partialPath}`,
          element,
        )
      }
      default:
        return null
    }
  })
}
