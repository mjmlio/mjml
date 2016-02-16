module.exports = {
  paddingParser: function(direction) {
    const mjAttribute = this.mjAttribute.bind(this)
    const paddingDirection = mjAttribute(`padding-${direction}`)
    const padding = mjAttribute('padding')

    if (paddingDirection) {
      return parseInt(paddingDirection)
    }

    if (!padding) {
      return 0
    }

    const paddings = padding.split(' ')
    let directions = {}

    switch (paddings.length) {
      case 1:
        return parseInt(padding)
      case 2:
        directions = {top: 0, bottom: 0, left: 1, right: 1}
        break;
      case 3:
        directions = {top: 0, left: 1, right: 1, bottom: 2}
        break;
      case 4:
        directions = {top: 0, right: 1, bottom: 2, left: 3}
        break;
    }

    return parseInt(paddings[directions[direction]] || 0 )
  },

  widthParser: function(width) {
    const widthUnit = /[0-9]+([^ ,\)`]*)/.exec(width.toString())[1]

    return { unit: widthUnit || "px", width: parseInt(width) }
  }
}
