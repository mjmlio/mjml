export default function ruleError(message, element) {
  const { line, tagName, includedIn } = element

  return {
    line,
    message,
    tagName,
    formattedMessage: `Line ${line}${formatInclude(element)} (${tagName}) — ${message}`,
  }
}

function formatInclude(element) {
  const { includedIn, file: parentFile } = element
  if (!includedIn.length) return ''

  const formattedIncluded = includedIn.slice().reverse().map(({line, file}) => {
    return `line ${line} of file ${file}`
  }).join(', itself included at ')

  return ` of ${parentFile}, included at ${formattedIncluded}`
}
