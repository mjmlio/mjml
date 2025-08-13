import { BodyComponent } from 'mjml-core'

export default class MjBody extends BodyComponent {
  static componentName = 'mj-body'

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
    const {
      setBackgroundColor,
      globalData: { lang, dir, title },
    } = this.context
    setBackgroundColor(this.getAttribute('background-color'))

    return `
      <div
        ${this.htmlAttributes({
          ...(title && { 'aria-label': title }),
          'aria-roledescription': 'email',
          class: this.getAttribute('css-class'),
          style: 'div',
          role: 'article',
          lang,
          dir,
        })}
      >
        ${this.renderChildren()}
      </div>
    `
  }
}
