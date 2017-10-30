import { BodyComponent } from 'mjml-core'

export default class MjTable extends BodyComponent {
  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,right,center)',
    cellpadding: 'integer',
    cellspacing: 'integer',
    'container-background-color': 'color',
    color: 'color',
    'font-family': 'string',
    'font-size': 'unit(px,%)',
    'font-style': 'string',
    'font-weight': 'string',
    'line-height': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'table-layout': 'enum(auto,fixed)',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'integer',
  }

  static defaultAttributes = {
    align: 'left',
    cellpadding: '0',
    cellspacing: '0',
    color: '#000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    padding: '10px 25px',
    'table-layout': 'auto',
    width: '100%',
  }

  getStyles() {
    return {
      table: {
        cellpadding: this.getAttribute('cellspadding'),
        cellspacing: this.getAttribute('cellspacing'),
        color: this.getAttribute('color'),
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'line-height': this.getAttribute('line-height'),
        'table-layout': this.getAttribute('table-layout'),
      },
    }
  }

  render() {
    const tableAttributes = ['cellpading', 'cellspacing', 'width'].map(v => ({
      [v]: this.getAttribute(v),
    }))

    return `
      <table
        ${this.htmlAttributes({
          ...tableAttributes,
          border: '0',
          style: 'table',
        })}
      >
        ${this.getContent()}
      </table>
    `
  }
}
