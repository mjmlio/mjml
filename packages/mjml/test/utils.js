// eslint-disable-next-line import/prefer-default-export
export function extractStyle(style, prop) {
  const idx = style.indexOf(`${prop}:`)
  if (idx === -1) {
    return undefined
  }
  const start = idx + prop.length + 1
  const end = style.indexOf(';', start)
  if (end === -1) {
    return style.substring(start).trim()
  }
  return style.substring(start, end).trim()
}
