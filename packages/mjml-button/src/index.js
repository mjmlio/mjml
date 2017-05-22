import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-button', {
  tagOmission: true,
  defaultAttributes: {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    'padding': '10px 25px',
    'width': '100%',
  },
  getStyles () {
    return {
      div: {
        'border-top': `${this.getMjAttribute('border-width')} ${this.getMjAttribute('border-style')} ${this.getMjAttribute('border-color')}`,
        'font-size': '1px',
        'margin': '0px auto',
        'width': this.getMjAttribute('width'),
      }
    }
  },
  render () {
    return `
      <button></button>
    `
  }
})
