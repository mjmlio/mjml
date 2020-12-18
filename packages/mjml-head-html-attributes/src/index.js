import { get } from 'lodash'
import { HeadComponent } from 'mjml-core'

export default class MjHtmlAttributes extends HeadComponent {
  static componentName = 'mj-html-attributes'

  handler() {
    const { add } = this.context
    const { children } = this.props

    children
      .filter((c) => c.tagName === 'mj-selector')
      .forEach((selector) => {
        const { attributes, children } = selector
        const { path } = attributes

        const custom = children
          .filter(
            (c) =>
              c.tagName === 'mj-html-attribute' && !!get(c, 'attributes.name'),
          )
          .reduce(
            (acc, c) => ({
              ...acc,
              [c.attributes.name]: c.content,
            }),
            {},
          )

        add('htmlAttributes', path, custom)
      })
  }
}
