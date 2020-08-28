// # OPTIMIZE ME: — check if previous conditionnal is `<!--[if mso | I`]>` too
export default (content) =>
  content.replace(/(<!\[endif]-->\s*?<!--\[if mso \| IE]>)/gm, '')
