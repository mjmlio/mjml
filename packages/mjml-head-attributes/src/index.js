import forEach from 'lodash/forEach'
import omit from 'lodash/omit'
import reduce from 'lodash/reduce'

import { HeadComponent } from 'mjml-core'

export default class MjAttributes extends HeadComponent {
  handler() {
    const { add } = this.context

    const { children } = this.props

    forEach(children, child => {
      const { tagName, attributes, children } = child

      if (tagName === 'mj-class') {
        add('classes', attributes.name, omit(attributes, ['name']))

        add(
          'classesDefault',
          attributes.name,
          reduce(
            children,
            (acc, { tagName, attributes }) => ({
              ...acc,
              [tagName]: attributes,
            }),
            {},
          ),
        )
      } else {
        add('defaultAttributes', tagName, attributes)
      }
    })
  }
}
