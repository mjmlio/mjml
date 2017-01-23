export default {
  name: "mj-style",
  endingTag: true,
  handler: ({ content, attributes }, globalAttributes) => {
    if ( attributes.inline == "inline") {
      globalAttributes.inlineCSS.push(content)
    } else {
      globalAttributes.css.push(content)
    }
  }
}
