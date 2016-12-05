import find from "lodash/find"

export default {
  name: "mj-font",
  handler: (element, { fonts }) => {
    const font = find(fonts, ['name', element.attributes.name])

    if (font) {
      font.url = element.attributes.href
    } else {
      fonts.push({ name: element.attributes.name, url: element.attributes.href })
    }
  }
}
