export const widthParser = width => {
  const widthUnit = /[0-9]+([^ ,\)`]*)/.exec(width.toString())[1]

  return { unit: widthUnit || 'px', width: parseInt(width) }
}
