import MjSection from 'mjml-section'
import { suffixCssClasses } from 'mjml-core'

export default class MjWrapper extends MjSection {
  static componentName = 'mj-wrapper'

  renderWrappedChildren() {
    const { children } = this.props
    const { containerWidth } = this.context

    return `
      ${this.renderChildren(children, {
        renderer: (component) =>
          component.constructor.isRawElement()
            ? component.render()
            : `
          <!--[if mso | IE]>
            <tr>
              <td
                ${component.htmlAttributes({
                  align: component.getAttribute('align'),
                  class: suffixCssClasses(
                    component.getAttribute('css-class'),
                    'outlook',
                  ),
                  width: containerWidth,
                })}
              >
          <![endif]-->
            ${component.render()}
          <!--[if mso | IE]>
              </td>
            </tr>
          <![endif]-->
        `,
      })}
    `
  }
}
