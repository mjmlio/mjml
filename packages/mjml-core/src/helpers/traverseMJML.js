import flattenDeep from 'lodash/flattenDeep'
import head from 'lodash/head'
import map from 'lodash/map'
import noop from 'lodash/noop'

export default function traverseMJML(mjml, predicate = noop, ignoreTagContent = null) {
  const traverse = mjml =>
    map(mjml.children, child => {
      if (ignoreTagContent && child.tagName === ignoreTagContent) {
        return []
      }

      if (predicate(child)) {
        return child
      }

      return traverse(child)
    })

  return head(flattenDeep(traverse(mjml)))
}
