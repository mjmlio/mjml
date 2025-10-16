import widthParser from 'mjml-core/lib/helpers/widthParser'

import { BodyComponent } from 'mjml-core'
import { reduce } from 'lodash'

export default class MjTable extends BodyComponent {
  static componentName = 'mj-table'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,right,center)',
    border: 'string',
    cellpadding: 'integer',
    cellspacing: 'integer',
    'container-background-color': 'color',
    color: 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-weight': 'string',
    'line-height': 'unit(px,%,)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    role: 'enum(none,presentation)',
    'table-layout': 'enum(auto,fixed,initial,inherit)',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%,auto)',
  }

  static defaultAttributes = {
    align: 'left',
    border: 'none',
    cellpadding: '0',
    cellspacing: '0',
    color: '#000000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    padding: '10px 25px',
    'table-layout': 'auto',
    width: '100%',
  }

  getStyles() {
    const hasCellspacing = this.hasCellspacing()
    return {
      table: {
        color: this.getAttribute('color'),
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'line-height': this.getAttribute('line-height'),
        'table-layout': this.getAttribute('table-layout'),
        width: this.getAttribute('width'),
        border: this.getAttribute('border'),
        ...(hasCellspacing && { 'border-collapse': 'separate' }),
      },
    }
  }

  getWidth() {
    const width = this.getAttribute('width')

    if (width === 'auto') {
      return width
    }

    const { parsedWidth, unit } = widthParser(width)
    return unit === '%' ? width : parsedWidth
  }

  hasCellspacing() {
    const cellspacing = this.getAttribute('cellspacing')
    const numericValue = parseFloat(String(cellspacing).replace(/[^\d.]/g, ''))
    return !Number.isNaN(numericValue) && numericValue > 0
  }

  render() {
    const tableAttributes = reduce(
      ['cellpadding', 'cellspacing', 'role'],
      (acc, v) => ({
        ...acc,
        [v]: this.getAttribute(v),
      }),
      {},
    )

    return `
      <table
        ${this.htmlAttributes({
          ...tableAttributes,
          width: this.getWidth(),
          border: '0',
          style: 'table',
        })}
      >
        ${this.getContent()}
      </table>
    `
  }
}
