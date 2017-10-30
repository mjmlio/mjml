const unitRegex = /[\d.,]*(\D*)$/

export default function widthParser(width, options = {}) {
  const { parseFloatToInt = true } = options

  const widthUnit = unitRegex.exec(width.toString())[1]
  const unitParsers = {
    default: parseInt,
    px: parseInt,
    '%': parseFloatToInt ? parseInt : parseFloat,
  }
  const parser = unitParsers[widthUnit] || unitParsers.default

  return {
    parsedWidth: parser(width),
    unit: widthUnit || 'px',
  }
}
