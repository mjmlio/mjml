import MjSection from 'mjml-section'
import { suffixCssClasses } from 'mjml-core'
import { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'

export default class MjWrapper extends MjSection {
  static componentName = 'mj-wrapper'

  static allowedAttributes = {
    ...MjSection.allowedAttributes,
    gap: 'unit(px)',
  }

  renderWrappedChildren() {
    const { children } = this.props
    const { containerWidth } = this.context

    return `
      ${this.renderChildren(children, {
        renderer: (component) =>
          component.constructor.isRawElement()
            ? component.render()
            : `
          ${msoConditionalTag(`
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
          `)}
            ${component.render()}
          ${msoConditionalTag(`
              </td>
            </tr>
          `)}
        `,
      })}
    `
  }
}
