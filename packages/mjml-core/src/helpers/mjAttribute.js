const unitRegex = /[\d\.,]*(\D*)$/

export const widthParser = (width, opts = { parseFloatToInt: true }) => {
  const widthUnit = unitRegex.exec(width.toString())[1]
  const unitParsers = { default: parseInt, px: parseInt, '%': opts.parseFloatToInt ? parseInt : parseFloat}
  const widthParser = unitParsers[widthUnit] || unitParsers['default']

  return { unit: widthUnit || 'px', width: widthParser(width) }
}

export const defaultUnit = (units, defaultUnit = 'px') => {
  if (units === undefined || units === '' || units === null) {
    return undefined
  }

  return units
    .toString()
    .split(' ')
    .map(unit => {
      const parsedUnit = unitRegex.exec(unit.toString())[1]
      return parsedUnit ? unit : unit.toString() + defaultUnit
    })
    .join(' ')
}
