import compact from 'lodash/compact'
import each from 'lodash/each'
import filter from 'lodash/filter'
import omit from 'lodash/omit'

export default {
  name: "mj-attributes",
  handler: (element, { defaultAttributes, cssClasses }) => {
    each(compact(filter(element.children, child => child.tagName)), elem => {
      const tagName = element.tagName
      const attributes = element.attributes;

      if (tagName === 'mj-class') {
        return cssClasses[attributes.name] = omit(attributes, ['name'])
      }

      defaultAttributes[tagName] =  attributes
    })
  }
}
