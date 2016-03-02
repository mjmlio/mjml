const MJMLStandardElements = {
  'body': require('./components/Body').default,
  'button': require('./components/Button').default,
  'column': require('./components/Column').default,
  'divider': require('./components/Divider').default,
  'group': require('./components/Group').default,
  'html': require('./components/Html').default,
  'image': require('./components/Image').default,
  'list': require('./components/List').default,
  'raw': require('./components/Raw').default,
  'section': require('./components/Section').default,
  'social': require('./components/Social').default,
  'text': require('./components/Text').default,
  'table': require('./components/Table').default,
  'invoice': require('./components/Invoice').default,
  'invoice-item': require('./components/Invoice/Item').default
}

export const endingTags = ["mj-text", "mj-html", "mj-button", "mj-list", "mj-raw", "mj-table", "mj-invoice-item"]
export const unsafeTags = ["mj-raw"]

export function registerElement(tagName, element, options = {}) {
  MJMLStandardElements[tagName] = element

  if (options.endingTag) {
    endingTags.push(`mj-${tagName}`)
  }

  if (options.unsafeTags) {
    unsafeTags.push(`mj-${tagName}`)
  }

  return true
}

export default MJMLStandardElements;
