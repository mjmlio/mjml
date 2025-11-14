export function extractStyle(style, prop) {
  const start = style.indexOf(`${prop}:`) + prop.length + 1
  const end = style.indexOf(';', start)
  if (end === -1) {
    return style.substring(start).trim()
  }
  return style.substring(start, end).trim()
}
