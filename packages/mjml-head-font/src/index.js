export default (el, { fonts }) => {
  fonts.push({ name: el.attribs.name, url: el.attribs.href })
}
