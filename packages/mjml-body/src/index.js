import { BodyComponent } from 'mjml-core'

export default class MjBody extends BodyComponent {
  static allowedAttributes = {
    width: 'unit(px)',
    'background-color': 'color',
  }

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
        ${this.renderChildren()}
      </div>
    `
  }
}
