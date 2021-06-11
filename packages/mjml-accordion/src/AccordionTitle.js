import { BodyComponent } from 'mjml-core'
import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'

export default class MjAccordionTitle extends BodyComponent {
  static componentName = 'mj-accordion-title'

  static endingTag = true

  static allowedAttributes = {
    'background-color': 'color',
    color: 'color',
    'font-size': 'unit(px)',
    'font-family': 'string',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
  }

  static defaultAttributes = {
    'font-size': '13px',
    padding: '16px',
  }

  getStyles() {
    return {
      td: {
        width: '100%',
        'background-color': this.getAttribute('background-color'),
        color: this.getAttribute('color'),
        'font-size': this.getAttribute('font-size'),
        'font-family': this.getAttribute('font-family'),
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
      td2: {
        padding: '16px',
        background: this.getAttribute('background-color'),
        'vertical-align': this.getAttribute('icon-align'),
      },
      img: {
        display: 'none',
        width: this.getAttribute('icon-width'),
        height: this.getAttribute('icon-height'),
      },
    }
  }

  renderTitle() {
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

  renderIcons() {
    return conditionalTag(
      `
      <td
        ${this.htmlAttributes({
          class: 'mj-accordion-ico',
          style: 'td2',
        })}
      >
        <img
          ${this.htmlAttributes({
            src: this.getAttribute('icon-wrapped-url'),
            alt: this.getAttribute('icon-wrapped-alt'),
            class: 'mj-accordion-more',
            style: 'img',
          })}
        />
        <img
          ${this.htmlAttributes({
            src: this.getAttribute('icon-unwrapped-url'),
            alt: this.getAttribute('icon-unwrapped-alt'),
            class: 'mj-accordion-less',
            style: 'img',
          })}
        />
      </td>
    `,
      true,
    )
  }

  render() {
    const contentElements = [this.renderTitle(), this.renderIcons()]
    const content = (this.getAttribute('icon-position') === 'right'
      ? contentElements
      : contentElements.reverse()
    ).join('\n')

    return `
      <div ${this.htmlAttributes({ class: 'mj-accordion-title' })}>
        <table
          ${this.htmlAttributes({
            'cell-spacing': '0',
            'cell-padding': '0',
            style: 'table',
          })}
        >
          <tbody>
            <tr>
              ${content}
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
}
