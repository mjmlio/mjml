const unitRegex = /[\d\.,]*(\D*)$/

export const widthParser = width => {
  const widthUnit = unitRegex.exec(width.toString())[1]

  return { unit: widthUnit || 'px', width: parseInt(width) }
}

export const defaultUnit = (units, defaultUnit) => {
  if (!units) {
    return units
  }

  return units.split(' ').map((unit) => {
    const parsedUnit = unitRegex.exec(unit.toString())[1]
    return parsedUnit ? unit : unit.toString() + defaultUnit
  }).join(' ')
}
