import each from "lodash/each"
import omit from "lodash/omit"
import compact from "lodash/compact"
import filter from "lodash/filter"

export default ($, {setMjCssClasses, setMjDefaultAttributes}) => {
  each(compact(filter($.children, child => child.tagName)), (elem) => {
    const tagName = elem.tagName.toLowerCase()
    const attributes = elem.attribs

    if (tagName == "mj-class") {
      setMjCssClasses(attributes.name, omit(attributes, ['name']))
      return
    }

    setMjDefaultAttributes(tagName, attributes)
  })
}
