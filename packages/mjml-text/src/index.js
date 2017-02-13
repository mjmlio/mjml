import { createBodyComponent } from 'mjml-core/lib/createComponent'
import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'

export default createBodyComponent('mj-text', {
  endingTag: true,
  allowedAttributes: {
    'align': 'string',
    'background-color': 'color',
    'color': 'color',
    'font-family': 'string',
    'font-size': 'string',
    'font-style': 'string',
    'font-weight': 'string',
    'height': 'string',
    'letter-spacing': 'string',
    'line-height': 'string',
    'padding-bottom': 'string',
    'padding-left': 'string',
    'padding-right': 'string',
    'padding-top': 'string',
    'padding': 'string',
    'text-decoration': 'string',
    'text-transform': 'string',
    'vertical-align': 'string',
  },
  defaultAttributes: {
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '1',
    'padding': '10px 25px',
    align: 'left',
    color: '#000000',
  },
  getStyles () {
    return {
      'font-family': this.getMjAttribute('font-family'),
      'font-size': this.getMjAttribute('font-size'),
      'font-weight': this.getMjAttribute('font-weight'),
      'letter-spacing': this.getMjAttribute('letter-spacing'),
      'line-height': this.getMjAttribute('line-height'),
      'line-height': this.getMjAttribute('line-height'),
      'text-align': this.getMjAttribute('align'),
      'text-decoration': this.getMjAttribute('text-decoration'),
      'text-transform': this.getMjAttribute('text-transform'),
      color: this.getMjAttribute('color'),
      height: this.getMjAttribute('height'),
    }
  },
  renderContent () {
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
  render () {
    const height = this.getMjAttribute('height')

    return height
      ? `
        ${conditionalTag(`
          <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="${height}" style="vertical-align:top;height:${height}px;">
        `)}
        ${this.renderContent()}
        ${conditionalTag(`
          </td></tr></table>
        `)}
      `
      : this.renderContent()
  }
})
