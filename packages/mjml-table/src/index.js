import { createBodyComponent } from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-table', {
  endingTag: true,
  allowedAttributes: {
    'align': 'enum(left,right,center)',
    'cellpadding': 'integer',
    'cellspacing': 'integer',
    'container-background-color': 'color',
    'color': 'color',
    'font-family': 'string',
    'font-size': 'unit(px,%)',
    'font-style': 'string',
    'font-weight': 'string',
    'line-height': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding': 'unit(px,%){1,4}',
    'table-layout': 'enum(auto,fixed)',
    'vertical-align': 'enum(top,bottom,middle)',
    'width': 'integer'
  },
  defaultAttributes: {
    'align': 'left',
    'cellpadding': '0',
    'cellspacing': '0',
    'color': '#000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px',
    'table-layout': 'auto',
    'width': '100%'
  },
  getStyles () {
    return {
      'cellpadding': this.getMjAttribute('cellspadding'),
      'cellspacing': this.getMjAttribute('cellspacing'),
      'color': this.getMjAttribute('color'),
      'font-family': this.getMjAttribute('font-family'),
      'font-size': this.getMjAttribute('font-size'),
      'line-height': this.getMjAttribute('line-height'),
      'table-layout': this.getMjAttribute('table-layout')
    }
  },
  render () {
    const tableAttributes = ['cellpading', 'cellspacing', 'width'].map(v => {
      return { [v]: this.getMjAttribute(v) }
    })

    return `
      <table
        ${this.generateHtmlAttributes({
          ...tableAttributes,
          border: "0",
          style: this.generateStyles(),
        })}
      >
        ${this.getMjContent()}
      </table>
    `
  }
})
