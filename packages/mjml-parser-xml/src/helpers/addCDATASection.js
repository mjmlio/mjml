import _ from 'lodash'

export const regexTag = tag => new RegExp(`<${tag}([^>\/]*)>([^.]*?)</${tag}>`, 'gmi')
export const replaceTag = tag => `<${tag}$1><![CDATA[$2]]></${tag}>`

export default function addCDATASection (CDATASections = [], content) {
  _.forEach(CDATASections, tag => {
    content = content.replace(regexTag(tag), replaceTag(tag))
  })

  return content
}
