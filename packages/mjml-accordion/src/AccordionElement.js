import { BodyComponent } from 'mjml-core'
import { find } from 'lodash'
import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'
import AccordionText from './AccordionText'
import AccordionTitle from './AccordionTitle'

export default class MjAccordionElement extends BodyComponent {
  static componentName = 'mj-accordion-element'

  static allowedAttributes = {
    'background-color': 'color',
    border: 'string',
    'font-family': 'string',
    'icon-align': 'enum(top,middle,bottom)',
    'icon-width': 'unit(px,%)',
    'icon-height': 'unit(px,%)',
    'icon-wrapped-url': 'string',
    'icon-wrapped-alt': 'string',
    'icon-unwrapped-url': 'string',
    'icon-unwrapped-alt': 'string',
    'icon-position': 'enum(left,right)',
  }

  static defaultAttributes = {
    title: {
      img: {
        width: '32px',
        height: '32px',
      },
    },
  }

  getStyles() {
    return {
      td: {
        padding: '0px',
        'background-color': this.getAttribute('background-color'),
      },
      label: {
        'font-size': '13px',
        'font-family': this.getAttribute('font-family'),
      },
      input: {
        display: 'none',
      },
    }
  }

  handleMissingChildren() {
    const { children } = this.props
    const childrenAttr = [
      'border',
      'icon-align',
      'icon-width',
      'icon-height',
      'icon-position',
      'icon-wrapped-url',
      'icon-wrapped-alt',
      'icon-unwrapped-url',
      'icon-unwrapped-alt',
    ].reduce(
      (res, val) => ({
        ...res,
        [val]: this.getAttribute(val),
      }),
      {},
    )

    const result = []

    if (!find(children, { tagName: 'mj-accordion-title' })) {
      result.push(
        new AccordionTitle({
          attributes: childrenAttr,
          context: this.getChildContext(),
        }).render(),
      )
    }

    result.push(this.renderChildren(children, { attributes: childrenAttr }))

    if (!find(children, { tagName: 'mj-accordion-text' })) {
      result.push(
        new AccordionText({
          attributes: childrenAttr,
          context: this.getChildContext(),
        }).render(),
      )
    }

    return result.join('\n')
  }

  render() {
    return `
      <tr
        ${this.htmlAttributes({
          class: this.getAttribute('css-class'),
        })}
      >
        <td ${this.htmlAttributes({ style: 'td' })}>
          <label
            ${this.htmlAttributes({
              class: 'mj-accordion-element',
              style: 'label',
            })}
          >
            ${conditionalTag(
              `
              <input
                ${this.htmlAttributes({
                  class: 'mj-accordion-checkbox',
                  type: 'checkbox',
                  style: 'input',
                })}
              />
            `,
              true,
            )}
            <div>
              ${this.handleMissingChildren()}
            </div>
          </label>
        </td>
      </tr>
    `
  }
}
