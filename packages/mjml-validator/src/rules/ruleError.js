export default (message, element) => {
  const { line, tagName } = element

  return {
    line,
    message,
    tagName,
    formattedMessage: `Line ${line} (${tagName}) — ${message}`
  }
}
