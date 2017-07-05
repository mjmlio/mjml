import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjColumn extends BodyComponent {

  // static allowedAttributes: {
  //   'background-color': 'color',
  //   border: 'unit(px)',
  //   'border-bottom': 'unit(px)',
  //   'border-left': 'unit(px)',
  //   'border-radius': 'unit(px)',
  //   'border-right': 'unit(px)',
  //   'border-top': 'unit(px)',
  //   direction: 'enum(ltr,rtl)',
  //   'padding-bottom': 'unit(px,%)',
  //   'padding-left': 'unit(px,%)',
  //   'padding-right': 'unit(px,%)',
  //   'padding-top': 'unit(px,%)',
  //   padding: 'unit(px,%){1,4}',
  //   'vertical-align': 'string',
  //   width: 'unit(px,%)',
  // }

  static defaultAttributes = {
    direction: 'ltr',
  }

  getChildContext() {
    const {
      containerWidth,
    } = this.context

    const {
      sibling,
    } = this.props

    const paddingSize = this.getShorthandAttrValue('padding', 'left') + this.getShorthandAttrValue('padding', 'right')

    let parentWidth = this.getAttribute('width') || `${parseFloat(containerWidth) / sibling}px`

    const {
      unit,
      parsedWidth,
    } = widthParser(parentWidth, {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      parentWidth = `${(parseFloat(containerWidth) * parsedWidth / 100) - paddingSize}px`
    } else {
      parentWidth = `${parsedWidth - paddingSize}px`
    }

    return {
      ...this.context,
      parentWidth,
    }
  }

  getStyles() {
    const tableStyle = {
      'background-color': this.getAttribute('background-color'),
      border: this.getAttribute('border'),
      'border-bottom': this.getAttribute('border-bottom'),
      'border-left': this.getAttribute('border-left'),
      'border-radius': this.getAttribute('border-radius'),
      'border-right': this.getAttribute('border-right'),
      'border-top': this.getAttribute('border-top'),
      'vertical-align': this.getAttribute('vertical-align'),
    }

    return {
      'div': {
        'font-size': '13px',
        'text-align': 'left',
        'direction': this.getAttribute('direction'),
        'display': 'inline-block',
        'vertical-align': this.getAttribute('vertical-align'),
        'width': this.getMobileWidth(),
      },
      'table': {
        ...(this.hasGutter() ? {} : tableStyle),
      },
      'tdOutlook': {
        'vertical-align': this.getAttribute('vertical-align'),
        'width': this.getWidthAsPixel(),
      },
      'gutter': {
        ...tableStyle,
        'padding': this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
      }
    }
  }

  getMobileWidth() {
    const { sibling } = this.props
    const width = this.getAttribute('width')
    const mobileWidth = this.getAttribute('mobileWidth')

    if (mobileWidth != "mobileWidth" ) {
      return '100%'
    } else if (width == undefined) {
      return `${parseInt(100 / sibling)}%`
    }

    const {
      unit,
      parsedWidth,
    } = widthParser(width, {
      parseFloatToInt: false,
    })

    switch (unit) {
      case '%':
        return width
      case 'px':
      default:
        return `${parsedWidth / parentWidth}%`
    }
  }

  getWidthAsPixel() {
    const {
      containerWidth
    } = this.context

    const {
      unit,
      parsedWidth,
    } = widthParser(this.getParsedWidth(true), {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      return `${(parseFloat(containerWidth) * parsedWidth / 100)}px`
    } else {
      return `${parsedWidth}px`
    }
  }

  getParsedWidth(toString) {
    const {
      sibling,
    } = this.props

    const width = this.getAttribute('width') || `${100 / sibling}%`

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
  }

  getColumnClass() {
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
  }

  hasGutter() {
    return this.getAttribute('padding') !== null
  }

  renderGutter() {
    return `
      <table
        ${this.htmlAttributes({
          background: this.getAttribute('background-color'),
          border: 0,
          cellpadding: 0,
          cellspacing: 0,
          role: 'presentation',
          width: '100%',
        })}
      >
        <tbody>
          <tr>
            <td ${this.htmlAttributes({ style: 'gutter' })}>
              ${this.renderColumn()}
            </td>
          </tr>
        </tbody>
      </table>
    `
  }

  renderColumn() {
    const {
      children,
    } = this.props

    return `
      <table
        ${this.htmlAttributes({
          background: this.hasGutter() ? null : this.getAttribute('background-color'),
          border: 0,
          cellpadding: 0,
          cellspacing: 0,
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
                  ${component.htmlAttributes({
                    align: component.getAttribute('align'),
                    background: component.getAttribute('container-background-color'),
                    style: {
                      'background': component.getAttribute('container-background-color'),
                      'font-size': '0px',
                      'padding': component.getAttribute('padding'),
                      'padding-top': component.getAttribute('padding-top'),
                      'padding-right': component.getAttribute('padding-right'),
                      'padding-bottom': component.getAttribute('padding-bottom'),
                      'padding-left': component.getAttribute('padding-left'),
                      'word-break': 'break-word',
                    },
                  })}
                >
                  ${component.render()}
                </td>
              </tr>
            `,
          })}
        </tbody>
      </table>
    `
  }

  render() {
    return `
      <div
        ${this.htmlAttributes({
          class: `${this.getColumnClass()} outlook-group-fix`,
          style: 'div',
        })}
      >
        ${this.hasGutter() ? this.renderGutter() : this.renderColumn()}
      </div>
    `
  }

}
