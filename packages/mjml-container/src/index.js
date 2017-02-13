import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-container', {
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
      'background-color': this.getMjAttribute('background-color'),
    }
  },
  render () {
    return `
      <div
        ${this.generateHtmlAttributes({
          'background-color': this.getMjAttribute('background-color'),
          style: this.generateStyles(),
        })}
      >
        ${this.renderChildren()}
      </div>
    `
  }
})
