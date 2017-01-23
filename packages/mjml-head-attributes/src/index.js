import each from 'lodash/each'
import omit from 'lodash/omit'
import assign from 'lodash/assign'

export default {
  name: "mj-attributes",
  handler: (element, globalAttributes) => {
    each(element.children, ({attributes, tagName}) => {
      if (tagName === 'mj-class') {
        return globalAttributes.cssClasses[attributes.name] = assign(globalAttributes.cssClasses[attributes.name], omit(attributes, ['name']))
      }

      globalAttributes.defaultAttributes[tagName] = assign(globalAttributes.defaultAttributes[tagName], attributes)
    })
  }
}
