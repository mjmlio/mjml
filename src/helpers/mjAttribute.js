export const widthParser = width => {
  const widthUnit = /[\d\.,]*(\D*)$/.exec(width.toString())[1]

  return { unit: widthUnit || 'px', width: parseInt(width) }
}
