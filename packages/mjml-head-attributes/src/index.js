import compact from 'lodash/compact'
import each from 'lodash/each'
import filter from 'lodash/filter'
import omit from 'lodash/omit'

export default ($, { defaultAttributes, cssClasses }) => {
  each(compact(filter($.children, child => child.tagName)), elem => {
    const tagName = elem.tagName.toLowerCase()
    const attributes = elem.attribs

    if (tagName == 'mj-class') {
      return cssClasses[attributes.name] = omit(attributes, ['name'])
    }

    defaultAttributes[tagName] =  attributes
  })
}
