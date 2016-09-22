export default (message, element) => {
  const { lineNumber: line, tagName } = element

  return {
    line,
    message,
    tagName,
    formattedMessage: `Line ${line} (${tagName}) — ${message}\n`
  }
}
