import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjGroup extends BodyComponent {
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
  }

  getChildContext() {
    const { containerWidth } = this.context
    const { sibling } = this.props
    const paddingSize =
      this.getShorthandAttrValue('padding', 'left') +
      this.getShorthandAttrValue('padding', 'right')

    let parentWidth =
      this.getAttribute('width') || `${parseFloat(containerWidth) / sibling}px`

    const { unit, parsedWidth } = widthParser(parentWidth, {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      parentWidth = `${parseFloat(containerWidth) * parsedWidth / 100 -
        paddingSize}px`
    } else {
      parentWidth = `${parsedWidth - paddingSize}px`
    }

    return {
      ...this.context,
      containerWidth,
    }
  }

  getStyles() {
    return {
      div: {
        'font-size': '0',
        'line-height': '0',
        'text-align': 'left',
        direction: this.getAttribute('direction'),
        display: 'inline-block',
        'vertical-align': this.getAttribute('vertical-align'),
        width: '100%',
      },
      table: {
        'background-color': this.getAttribute('background-color'),
        border: this.getAttribute('border'),
        'border-bottom': this.getAttribute('border-bottom'),
        'border-left': this.getAttribute('border-left'),
        'border-radius': this.getAttribute('border-radius'),
        'border-right': this.getAttribute('border-right'),
        'border-top': this.getAttribute('border-top'),
        'vertical-align': this.getAttribute('vertical-align'),
      },
      tdOutlook: {
        'vertical-align': this.getAttribute('vertical-align'),
        width: this.getWidthAsPixel(),
      },
    }
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

  render() {
    const { children, sibling } = this.props

    const { containerWidth: groupWidth } = this.getChildContext()

    const { containerWidth } = this.context

    const getElementWidth = width => {
      if (!width) {
        return `${parseInt(containerWidth, 10) / parseInt(sibling, 10)}px`
      }

      const { unit, parsedWidth } = widthParser(width, {
        parseFloatToInt: false,
      })

      if (unit === '%') {
        return `${100 * parsedWidth / groupWidth}px`
      }
      return `${parsedWidth}${unit}`
    }

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
        <!--[if mso | IE]>
        <table  role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
        <![endif]-->
          ${this.renderChildren(children, {
            attributes: { mobileWidth: 'mobileWidth' },
            renderer: component =>
              component.rawElement
                ? component.render()
                : `
              <!--[if mso | IE]>
              <td
                ${component.htmlAttributes({
                  style: {
                    align: component.getAttribute('align'),
                    width: getElementWidth(component.getAttribute('width')),
                  },
                })}
              >
              <![endif]-->
                ${component.render()}
              <!--[if mso | IE]>
              </td>
              <![endif]-->
          `,
          })}
        <!--[if mso | IE]>
          </tr>
          </table>
        <![endif]-->
      </div>
    `
  }
}
