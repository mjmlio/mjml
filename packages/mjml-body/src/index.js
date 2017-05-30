import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-body', {
  defaultAttributes: {
    width: '600px',
  },
  getChildContext () {
    return {
      ...this.context,
      containerWidth: this.getMjAttribute('width'),
    }
  },
  getStyles () {
    return {
      div: {
        'background-color': this.getMjAttribute('background-color'),
      }
    }
  },
  render () {
    return `
      <div
        ${this.generateHtmlAttributes({
          'background-color': this.getMjAttribute('background-color'),
          style: 'div',
        })}
      >
        ${this.renderChildren()}
      </div>
    `
  }
})
