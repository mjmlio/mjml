import find from "lodash/find"

export default {
  name: "mj-font",
  endingTag: true,
  handler: ({ attributes }, globalAttributes) => {
    const font = find(globalAttributes.fonts, ['name', attributes.name])

    if (font) {
      font.url = attributes.href
    } else {
      globalAttributes.fonts.push({ name: attributes.name, url: attributes.href })
    }
  }
}
