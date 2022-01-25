import { BodyComponent } from 'mjml-core'
import buildPreview from './helpers/preview'

export default class MjBody extends BodyComponent {
  static componentName = 'mj-body'

  static allowedAttributes = {
    width: 'unit(px)',
    'background-color': 'color',
    id: 'string',
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
      body: {
        'word-spacing': 'normal',
        'background-color': this.getAttribute('background-color'),
      },
      div: {
        'background-color': this.getAttribute('background-color'),
      },
    }
  }

  render() {
    const { preview, lang } = this.context.getGlobalDatas()

    return `
      <body ${this.htmlAttributes({
        id: this.getAttribute('id'),
        class: this.getAttribute('css-class'),
        style: 'body',
      })}>
        ${buildPreview(preview)}
        <div ${this.htmlAttributes({
          lang,
          style: 'div',
        })}>
          ${this.renderChildren()}
        </div>
      </body>
    `
  }
}
