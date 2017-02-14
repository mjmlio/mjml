import _ from 'lodash'

const regexTag = tag => new RegExp(`<${tag}(\s("[^"]*"|'[^']*'|[^'">])*)?>`, 'gmi')
const regexAttributes = /(\S+)\s*?=\s*([\'"])(.*?|)\2/gmi

export default function parseAttributes (MJElements, content) {
  _.forEach(MJElements, tag => {
    content = content.replace(regexTag(tag), contentTag => {
      return contentTag.replace(regexAttributes, (match, attr, around, value) => `${attr}=${around}${encodeURIComponent(value)}${around}`)
    })
  })

  return content
}
