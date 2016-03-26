export const regexForSpeedyTag = new RegExp(`( *)= *([a-z-]+) *([^>]*)`)
export const orphansTags =  ['img', 'br', 'hr', 'input', 'area', 'link',
'mj-invoice-item', 'mj-social', 'mj-image', 'mj-divider', 'mj-location']

export const speedyTagToMJM = content => {
  const lines = content.split('\n')
  const stack = []
  let mjmContent = ''
  lines.forEach(line => {
    const match = line.match(regexForSpeedyTag)
    if (match) {
      if (match[3]) { match[3] = ' ' + match[3] }
      const nb_space = match[1].length
      if (orphansTags.indexOf(match[2]) < 0) {
        mjmContent += match[1] + '<' + match[2] + match[3] + '/>' + '\n'
      } else {
        if (stack.length > 0 && nb_space <= stack[stack.length - 1][0]) {
          while (stack.length > 0 && nb_space <= stack[stack.length - 1][0]) {
            mjmContent += stack[stack.length - 1][1] + '</' + stack[stack.length - 1][2] + '>' + '\n'
            stack.pop()
          }
        }
        stack.push([nb_space, match[1], match[2], + match[3]])
        mjmContent += match[1] + '<' + match[2] + match[3] + '>' + '\n'
      }
    } else if (line != '' && line != ' ') { mjmContent += line + '\n' }
  })
  while (stack.length > 0) {
    mjmContent += stack[stack.length - 1][1] + '</' + stack[stack.length - 1][2] + '>' + '\n'
    stack.pop()
  }
  return mjmContent;
}

export const presenceOfSpeedyTag = content => {
  const lines = content.split('\n')
  let ret = false
  lines.forEach(line => {
    const match = line.match(regexForSpeedyTag)
    if (match) { ret = true }
  })
  return ret
}
