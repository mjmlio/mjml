import _ from 'lodash'

import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-attributes', {
  handler () {
    const { add } = this.context
    const {
      children,
    } = this.props

    _.forEach(children, child => {
      const {
        tagName,
        attributes,
      } = child

      if (tagName === 'mj-class') {
        add('classes', attributes.name, _.omit(attributes, [ 'name' ]))
      } else {
        add('defaultAttributes', tagName, attributes)
      }
    })
  }
})
