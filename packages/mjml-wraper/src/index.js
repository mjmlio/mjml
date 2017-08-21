import MjSection from 'mjml-section'

export default class MjWrapper extends MjSection {

  renderWrappedChildren() {
    const {
      children,
    } = this.props

    const {
      containerWidth,
    } = this.context

    return `
      ${this.renderChildren(children, {
        renderer: component => component.rawElement ? component.render() : `
          <!--[if mso | IE]>
            <tr>
              <td
                ${component.htmlAttributes({
                  align: component.getAttribute('align'),
                  class: component.getAttribute('css-class') ?
                  component.getAttribute('css-class')
                    .split(' ')
                    .map(c => `${c}-outlook`)
                    .join(' ')
                  : null,
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

