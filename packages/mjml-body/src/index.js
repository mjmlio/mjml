import { BodyComponent } from 'mjml-core'
import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'

export default class MjBody extends BodyComponent {
  static defaultAttributes = {
    width: '600px',
  }

  getChildContext() {
    return {
      ...this.context,
      containerWidth: this.getAttribute('width'),
    }
  }

  getStyles() {
    return {
      div: {
        'background-color': this.getAttribute('background-color'),
      },
      outlookTable: {
        width: '100%',
      },
      outlookTd: {
        'line-height': '0px',
        'font-size': '0px',
        'mso-line-height-rule': 'exactly',
      },
    }
  }

  render() {
    const { setBackgroundColor } = this.context
    setBackgroundColor(this.getAttribute('background-color'))

    return `
      <div
        ${this.htmlAttributes({
          class: this.getAttribute('css-class'),
          style: 'div',
        })}
      >
        ${conditionalTag(`
          <table ${this.htmlAttributes({
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
            width: '100%',
            style: 'outlookTable',
            align: 'center',
            bgcolor: this.getAttribute('background-color'),
          })}>
            <tr>
              <td ${this.htmlAttributes({ style: 'outlookTd' })}>
        `)}

          ${this.renderChildren()}
        ${conditionalTag('</td></tr></table>')}
      </div>
    `
  }
}
