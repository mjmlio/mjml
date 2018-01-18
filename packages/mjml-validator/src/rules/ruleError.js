export default function ruleError(message, element) {
  const { line, tagName, includedIn, absoluteFilePath } = element

  return {
    line,
    message,
    tagName,
    formattedMessage: `Line ${line} of ${absoluteFilePath}${formatInclude(element)} (${tagName}) — ${message}`,
  }
}

function formatInclude(element) {
  const { includedIn } = element
  if (!includedIn.length) return ''

  const formattedIncluded = includedIn.slice().reverse().map(({line, file}) => {
    return `line ${line} of file ${file}`
  }).join(', itself included at ')

  return `, included at ${formattedIncluded}`
}
