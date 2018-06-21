import { reduce } from 'lodash'

const shorthandRegex = /^#\w{3}$/
const replaceInputRegex = /^#(\w)(\w)(\w)$/
const replaceOutput = '#$1$1$2$2$3$3'

export default attrs => reduce(attrs, (acc, val, attr) => {
  let value = val
  if (attr.includes('color') && val.match(shorthandRegex)) {
    value = val.replace(replaceInputRegex, replaceOutput)
  }
  return {
    ...acc,
    [attr]: value,
  }
}, {})
