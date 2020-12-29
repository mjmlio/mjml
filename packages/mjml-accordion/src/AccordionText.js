import { BodyComponent } from 'mjml-core'

export default class MjAccordionText extends BodyComponent {
  static componentName = 'mj-accordion-text'

  static endingTag = true

  static allowedAttributes = {
    'background-color': 'color',
    'font-size': 'unit(px)',
    'font-family': 'string',
    'font-weight': 'string',
    'letter-spacing': 'unitWithNegative(px,em)',
    'line-height': 'unit(px,%,)',
    color: 'color',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
  }

  static defaultAttributes = {
    'font-size': '13px',
    'line-height': '1',
    padding: '16px',
  }

  getStyles() {
    return {
      td: {
        background: this.getAttribute('background-color'),
        'font-size': this.getAttribute('font-size'),
        'font-family': this.getAttribute('font-family'),
        'font-weight': this.getAttribute('font-weight'),
        'letter-spacing': this.getAttribute('letter-spacing'),
        'line-height': this.getAttribute('line-height'),
        color: this.getAttribute('color'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-top': this.getAttribute('padding-top'),
        padding: this.getAttribute('padding'),
      },
      table: {
        width: '100%',
        'border-bottom': this.getAttribute('border'),
      },
    }
  }

  renderContent() {
    return `
      <td
        ${this.htmlAttributes({
          class: this.getAttribute('css-class'),
          style: 'td',
        })}
      >
        ${this.getContent()}
      </td>
    `
  }

  render() {
    return `
      <div
        ${this.htmlAttributes({
          class: 'mj-accordion-content',
        })}
      >
        <table
          ${this.htmlAttributes({
            'cell-spacing': '0',
            'cell-padding': '0',
            style: 'table',
          })}
        >
          <tbody>
            <tr>
              ${this.renderContent()}
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
}
