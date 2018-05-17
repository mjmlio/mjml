export default content =>
  // find conditionnal comment blocks
  content.replace(/(<!--\[if\s[^\]]+]>)([\s\S]*?)(<!\[endif]-->)/gm, (match, prefix, content, suffix) => {
    // find spaces between tags
    const processedContent = content.replace(/(^|>)(\s+|\s+)*(<|$)/gm, (match, prefix, content, suffix) => {
      return `${prefix}${suffix}`
    })
    return `${prefix}${processedContent}${suffix}`
  })
