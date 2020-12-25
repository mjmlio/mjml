import { BodyComponent } from 'mjml-core'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'

export default class MjSpacer extends BodyComponent {
  static allowedAttributes = {
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-right': 'string',
    'border-top': 'string',
    'container-background-color': 'color',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    height: 'unit(px,%)',
  }

  static defaultAttributes = {
    height: '20px',
  }

  getStyles() {
    return {
      div: {
        height: this.getAttribute('height'),
        'line-height': this.getAttribute('height'),
      },
    }
  }

  render() {
    const height = this.getAttribute('height')

    return `
      <div
        ${this.htmlAttributes({
          style: 'div',
        })}
      >&#8202;</div>
    `
  }
}
