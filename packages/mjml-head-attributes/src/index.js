import forEach from 'lodash/forEach'
import omit from 'lodash/omit'

import { HeadComponent } from 'mjml-core'

export default class MjAttributes extends HeadComponent {
  handler() {
    const {
      add,
    } = this.context

    const {
      children,
    } = this.props

    forEach(children, (child) => {
      const {
        tagName,
        attributes,
      } = child

      if (tagName === 'mj-class') {
        add('classes', attributes.name, omit(attributes, ['name']))
      } else {
        add('defaultAttributes', tagName, attributes)
      }
    })
  }
}
