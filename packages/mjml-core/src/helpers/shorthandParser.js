export default function (cssValue, direction) {
  const splittedCssValue = cssValue.split(' ')
  let directions = {}

  switch (splittedCssValue.length) {
    case 1:
      return parseInt(cssValue)

    case 2:
      directions = { top: 0, bottom: 0, left: 1, right: 1 }
      break

    case 3:
      directions = { top: 0, left: 1, right: 1, bottom: 2 }
      break

    case 4:
      directions = { top: 0, right: 1, bottom: 2, left: 3 }
      break
  }

  return parseInt(splittedCssValue[directions[direction]] || 0)
}
