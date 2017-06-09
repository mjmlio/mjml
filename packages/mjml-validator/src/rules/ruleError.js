export default function ruleError(message, element) {
  const { line, tagName } = element

  return {
    line,
    message,
    tagName,
    formattedMessage: `Line ${line} (${tagName}) — ${message}`,
  }
}
