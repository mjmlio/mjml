import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-text', {
  endingTag: true,
  attributes: {
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px',
    align: 'left',
    color: '#000000',
  },
  getStyles () {
    return {
      'font-family': this.getMjAttribute('font-family'),
      'font-size': this.getMjAttribute('font-size'),
      'line-height': this.getMjAttribute('line-height'),
      align: this.getMjAttribute('align'),
      color: this.getMjAttribute('color'),
    }
  },
  render () {
    return `
      <div
        ${this.generateHtmlAttributes({
          style: this.generateStyles(),
        })}
      >
        ${this.getMjContent()}
      </div>
    `
  }
})
