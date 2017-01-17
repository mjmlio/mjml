import _ from 'lodash'

import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-attributes', {
  handler () {
    const {
      addClass,
      addDefaultAttributes,
    } = this.context
    const {
      children,
    } = this.props

    _.forEach(children, child => {
      const {
        tagName,
        attributes,
      } = child

      if (tagName === 'mj-class') {
        addClass(attributes.name, _.omit(attributes, [ 'name' ]))
      } else {
        addDefaultAttributes(tagName, attributes)
      }
    })
  }
})
