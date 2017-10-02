const regexTag = /<([^>])*>/gmi
const regexAttributes = /([^\s]*="|')([^"|']*)("|')/gmi

export default function parseAttributes(input) {
  const replaceAmp = match => `&amp;${match.length > 1 ? match.charAt(1) : ''}`
  const replaceAttrVal = match => match.replace(/&([^a]|$)/g, replaceAmp)

  return input
    .replace(
      regexTag,
      match => match.replace(
        regexAttributes,
        (m, beforeAttr, attrVal, afterAttr) => {
          let newAttrVal = attrVal.replace(/.*&([^a]|$).*/g, replaceAttrVal)
          newAttrVal = encodeURIComponent(attrVal)

          return `${beforeAttr}${newAttrVal}${afterAttr}`
        }
      )
    )
}

export function decodeAttributes(input) {
  return input
    .replace(
      regexTag,
      match => match.replace(
        regexAttributes,
        (match, beforeAttr, attrVal, afterAttr) => {
          const newAttrVal = decodeURIComponent(attrVal)

          return `${beforeAttr}${newAttrVal}${afterAttr}`
        }
      )
    )
}
