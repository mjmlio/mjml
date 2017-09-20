const fs = require('fs')

export default {
  name: "mj-style",
  endingTag: true,
  handler: ({ content, attributes }, globalAttributes) => {
    if (attributes.src) {
      content = fs.readFileSync(attributes.src, 'utf8')
    }
    if ( attributes.inline == "inline") {
      globalAttributes.inlineCSS.push(content)
    } else {
      globalAttributes.css.push(content)
    }
  }
}
