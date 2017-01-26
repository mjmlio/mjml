import compact from 'lodash/compact'
import each from 'lodash/each'
import filter from 'lodash/filter'
import omit from 'lodash/omit'
import assign from 'lodash/assign'
import { helpers } from 'mjml-core'

export default {
  name: "mj-attributes",
  handler: (element, { defaultAttributes, cssClasses }) => {
    each(compact(filter(element.children, child => child.tagName)), elem => {
      const tagName = elem.tagName.toLowerCase()
      const attributes = helpers.dom.getAttributes(elem);

      if (tagName === 'mj-class') {
        return cssClasses[attributes.name] = assign(cssClasses[attributes.name], omit(attributes, ['name']))
      }

      defaultAttributes[tagName] = assign(defaultAttributes[tagName], attributes)
    })
  }
}
