import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjColumn extends BodyComponent {
  static allowedAttributes = {
    'background-color': 'color',
    border: 'unit(px)',
    'border-bottom': 'unit(px)',
    'border-left': 'unit(px)',
    'border-radius': 'unit(px)',
    'border-right': 'unit(px)',
    'border-top': 'unit(px)',
    direction: 'enum(ltr,rtl)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'vertical-align': 'string',
    width: 'unit(px,%)',
  }

  static defaultAttributes = {
    direction: 'ltr',
    'vertical-align': 'top',
  }

  getChildContext() {
    const { containerWidth: parentWidth } = this.context

    const { sibling } = this.props

    const paddingSize =
      this.getShorthandAttrValue('padding', 'left') +
      this.getShorthandAttrValue('padding', 'right')

    let containerWidth =
      this.getAttribute('width') || `${parseFloat(parentWidth) / sibling}px`

    const { unit, parsedWidth } = widthParser(containerWidth, {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      containerWidth = `${parseFloat(parentWidth) * parsedWidth / 100 -
        paddingSize}px`
    } else {
      containerWidth = `${parsedWidth - paddingSize}px`
    }

    return {
      ...this.context,
      containerWidth,
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
      div: {
        'font-size': '13px',
        'text-align': 'left',
        direction: this.getAttribute('direction'),
        display: 'inline-block',
        'vertical-align': this.getAttribute('vertical-align'),
        width: this.getMobileWidth(),
      },
      table: {
        ...(this.hasGutter() ? {} : tableStyle),
      },
      tdOutlook: {
        'vertical-align': this.getAttribute('vertical-align'),
        width: this.getWidthAsPixel(),
      },
      gutter: {
        ...tableStyle,
        padding: this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
      },
    }
  }

  getMobileWidth() {
    const { sibling, containerWidth } = this.context
    const width = this.getAttribute('width')
    const mobileWidth = this.getAttribute('mobileWidth')

    if (mobileWidth !== 'mobileWidth') {
      return '100%'
    } else if (width === undefined) {
      return `${parseInt(100 / sibling, 10)}%`
    }

    const { unit, parsedWidth } = widthParser(width, {
      parseFloatToInt: false,
    })

    switch (unit) {
      case '%':
        return width
      case 'px':
      default:
        return `${parsedWidth / parseInt(containerWidth, 10)}%`
    }
  }

  getWidthAsPixel() {
    const { containerWidth } = this.context

    const { unit, parsedWidth } = widthParser(this.getParsedWidth(true), {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      return `${parseFloat(containerWidth) * parsedWidth / 100}px`
    }
    return `${parsedWidth}px`
  }

  getParsedWidth(toString) {
    const { sibling } = this.props

    const width = this.getAttribute('width') || `${100 / sibling}%`

    const { unit, parsedWidth } = widthParser(width, {
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
    const { addMediaQuery } = this.context

    let className = ''

    const { parsedWidth, unit } = this.getParsedWidth()

    switch (unit) {
      case '%':
        className = `mj-column-per-${parseInt(parsedWidth, 10)}`
        break

      case 'px':
      default:
        className = `mj-column-px-${parseInt(parsedWidth, 10)}`
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
    return this.getAttribute('padding') != null
  }

  renderGutter() {
    return `
      <table
        ${this.htmlAttributes({
          background: this.getAttribute('background-color'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
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
    const { children } = this.props

    return `
      <table
        ${this.htmlAttributes({
          background: this.hasGutter()
            ? null
            : this.getAttribute('background-color'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: 'table',
          width: '100%',
        })}
      >
        ${this.renderChildren(children, {
          renderer: (
            component, // eslint-disable-line no-confusing-arrow
          ) =>
            component.constructor.isRawElement()
              ? component.render()
              : `
            <tr>
              <td
                ${component.htmlAttributes({
                  align: component.getAttribute('align'),
                  'vertical-align': component.getAttribute('vertical-align'),
                  background: component.getAttribute(
                    'container-background-color',
                  ),
                  class: component.getAttribute('css-class'),
                  style: {
                    background: component.getAttribute(
                      'container-background-color',
                    ),
                    'font-size': '0px',
                    padding: component.getAttribute('padding'),
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
      </table>
    `
  }

  render() {
    let classesName = `${this.getColumnClass()} outlook-group-fix`

    if (this.getAttribute('css-class')) {
      classesName += ` ${this.getAttribute('css-class')}`
    }

    return `
      <div
        ${this.htmlAttributes({
          class: classesName,
          style: 'div',
        })}
      >
        ${this.hasGutter() ? this.renderGutter() : this.renderColumn()}
      </div>
    `
  }
}
