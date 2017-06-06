import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default createBodyComponent('mj-column', {
  allowedAttributes: {
    'background-color': 'color',
    'border': 'unit(px)',
    'border-bottom': 'unit(px)',
    'border-left': 'unit(px)',
    'border-radius': 'unit(px)',
    'border-right': 'unit(px)',
    'border-top': 'unit(px)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding': 'unit(px,%){1,4}',
    'vertical-align': 'string',
    'width': 'unit(px,%)',
  },
  getChildContext () {
    const {
      containerWidth,
    } = this.context
    const {
      sibling,
    } = this.props
    const paddingSize = this.getShorthandAttrValue('padding', 'left') + this.getShorthandAttrValue('padding', 'right')

    let parentWidth = this.getMjAttribute('width') || `${parseFloat(containerWidth) / sibling}px`

    const {
      unit,
      parsedWidth,
    } = widthParser(parentWidth, {
      parseFloatToInt: false,
    })

    if (unit == '%') {
      parentWidth = `${(parseFloat(containerWidth) * parsedWidth / 100) - paddingSize}px`
    } else {
      parentWidth = `${parsedWidth - paddingSize}px`
    }

    return {
      ...this.context,
      parentWidth,
    }
  },
  getStyles () {
    const tableStyle = {
      'background-color': this.getMjAttribute('background-color'),
      'border': this.getMjAttribute('border'),
      'border-bottom': this.getMjAttribute('border-bottom'),
      'border-left': this.getMjAttribute('border-left'),
      'border-radius': this.getMjAttribute('border-radius'),
      'border-right': this.getMjAttribute('border-right'),
      'border-top': this.getMjAttribute('border-top'),
    }

    return {
      'div': {
        'font-size': '13px',
        'text-align': 'left',
        'vertical-align': 'top',
        'direction': 'ltr',
        'display': 'inline-block',
        'width': '100%',
      },
      'table': {
        ...(this.hasGutter() ? {} : tableStyle),
      },
      'td-outlook' : {
        'vertical-align': this.getMjAttribute('vertical-align'),
        'width': this.getParsedWidth(true), // should be in PX for outlook
      },
      'gutter': {
        ...tableStyle,
        'padding': this.getMjAttribute('padding'),
        'padding-top': this.getMjAttribute('padding-top'),
        'padding-right': this.getMjAttribute('padding-right'),
        'padding-bottom': this.getMjAttribute('padding-bottom'),
        'padding-left': this.getMjAttribute('padding-left'),
      }
    }
  },
  getParsedWidth (toString) {
    const {
      sibling,
    } = this.props

    const width = this.getMjAttribute('width') || `${100 / sibling}%`

    const {
      unit,
      parsedWidth,
    } = widthParser(width, {
      parseFloatToInt: false,
    })

    if (toString) {
      return `${parsedWidth}${unit}`
    }

    return {
      unit,
      parsedWidth,
    }
  },
  getColumnClass () {
    const {
      addMediaQuery,
    } = this.context

    let className = ''

    const {
      parsedWidth,
      unit,
    } = this.getParsedWidth()

    switch (unit) {
      case '%':
        className = `mj-column-per-${parseInt(parsedWidth)}`
        break

      case 'px':
      default:
        className = `mj-column-px-${parseInt(parsedWidth)}`
        break
    }

    // Add className to media queries
    addMediaQuery(className, {
      parsedWidth,
      unit,
    })

    return className
  },
  hasGutter () {
    return this.getMjAttribute('padding') != null
  },
  renderGutter () {
    return `
      <table
        ${this.generateHtmlAttributes({
          background: this.getMjAttribute('background-color'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          width: '100%',
        })}
      >
        <tbody>
          <tr>
            <td ${this.generateHtmlAttributes({style: 'gutter'})}>
              ${this.renderColumn()}
            </td>
          </tr>
        </tbody>
      </table>
    `
  },
  renderColumn () {
    const {
      children,
    } = this.props

    return `
      <table
        ${this.generateHtmlAttributes({
          background: this.hasGutter() ? null : this.getMjAttribute('background-color'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: 'table',
          width: '100%',
        })}
      >
        <tbody>
          ${this.renderChildren(children, {
            renderer: component => component.rawElement ? component.render() : `
              <tr>
                <td
                  ${component.generateHtmlAttributes({
                    align: component.getMjAttribute('align'),
                    background: component.getMjAttribute('container-background-color'),
                    style: {
                      'background': component.getMjAttribute('container-background-color'),
                      'font-size': '0px',
                      'padding': component.getMjAttribute('padding'),
                      'padding-top': component.getMjAttribute('padding-top'),
                      'padding-right': component.getMjAttribute('padding-right'),
                      'padding-bottom': component.getMjAttribute('padding-bottom'),
                      'padding-left': component.getMjAttribute('padding-left'),
                      'word-break': 'break-word',
                    },
                  })}
                >
                  ${component.render()}
                </td>
              </tr>
            `
          })}
        </tbody>
      </table>
    `
  },
  render () {
    return `
      <div
        ${this.generateHtmlAttributes({
          'class': `${this.getColumnClass()} outlook-group-fix`,
          style: 'div',
        })}
      >
        ${this.hasGutter() ? this.renderGutter() : this.renderColumn()}
      </div>
    `
  }
})
