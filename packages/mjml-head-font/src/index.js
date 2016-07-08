export default {
  name: "mj-font",
  handler: (el, { fonts }) => {
    fonts.push({ name: el.attribs.name, url: el.attribs.href })
  }
}
