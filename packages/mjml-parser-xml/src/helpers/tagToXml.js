export default (tagName, attrs) => {
  let stringAttrs = Object.keys(attrs)
    .map(attr => `${attr}="${attrs[attr]}"`)
    .join(' ')

  stringAttrs = stringAttrs === '' ? '' : ` ${stringAttrs}`

  return `<${tagName}${stringAttrs}>`
}
