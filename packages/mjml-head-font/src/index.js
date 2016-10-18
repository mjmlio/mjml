import _ from "lodash"

export default {
  name: "mj-font",
  handler: (el, { fonts }) => {
    const font = _.find(fonts, ['name', el.attribs.name])

    if (font) {
      font.url = el.attribs.href
    } else {
      fonts.push({ name: el.attribs.name, url: el.attribs.href })
    }
  }
}
