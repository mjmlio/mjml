import { get } from 'lodash'
import { HeadComponent } from 'mjml-core'

export default class MjCustomAttributes extends HeadComponent {
  handler() {
    const { add } = this.context
    const { children } = this.props

    children
      .filter(c => c.tagName === 'mj-selector')
      .forEach(selector => {
        const { tagName, attributes, children } = selector
        const { path } = attributes

        const custom = children
          .filter(c => c.tagName === 'mj-custom' && !!get(c, 'attributes.name'))
          .reduce(
            (acc, c) => ({
              ...acc,
              [c.attributes.name]: c.content,
            }),
            {},
          )

        add('customAttributes', path, custom)
      })
  }
}
