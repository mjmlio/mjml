import { BodyComponent } from 'mjml-core'

export default class extends BodyComponent {

  static tagName = 'mj-body'

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
    return `
      <div
        ${this.htmlAttributes({
          style: 'div',
        })}
      >
        ${this.renderChildren()}
      </div>
    `
  }

}
