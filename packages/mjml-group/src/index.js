import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjGroup extends BodyComponent {

  static allowedAttributes = {
    'background-color': 'color',
    'border': 'unit(px)',
    'border-bottom': 'unit(px)',
    'border-left': 'unit(px)',
    'border-radius': 'unit(px)',
    'border-right': 'unit(px)',
    'border-top': 'unit(px)',
    'direction': 'enum(ltr,rtl)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding': 'unit(px,%){1,4}',
    'vertical-align': 'string',
    'width': 'unit(px,%)',
  }

  static defaultAttributes = {
    'direction': 'ltr',
  }

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
      containerWidth,
    }
  }

  getStyles () {
    return {
      'div': {
        'font-size': '0',
        'line-height': '0',
        'text-align': 'left',
        'direction': this.getMjAttribute('direction'),
        'display': 'inline-block',
        'vertical-align': this.getMjAttribute('vertical-align'),
        'width': '100%',
      },
      'table': {
        'background-color': this.getMjAttribute('background-color'),
        'border': this.getMjAttribute('border'),
        'border-bottom': this.getMjAttribute('border-bottom'),
        'border-left': this.getMjAttribute('border-left'),
        'border-radius': this.getMjAttribute('border-radius'),
        'border-right': this.getMjAttribute('border-right'),
        'border-top': this.getMjAttribute('border-top'),
        'vertical-align': this.getMjAttribute('vertical-align'),
      },
      'tdOutlook' : {
        'vertical-align': this.getMjAttribute('vertical-align'),
        'width': this.getWidthAsPixel(),
      }
    }
  }

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
  }

  render () {
    const {
      children,
      sibling,
    } = this.props

    const {
      containerWidth: groupWidth
    } = this.getChildContext()

    const {
      containerWidth
    } = this.context

    const getElementWidth = (width) => {
      if (!width) {
        return `${parseInt(containerWidth) / parseInt(sibling)}px`
      }

      const {
        unit,
        parsedWidth,
      } = widthParser(width, {
        parseFloatToInt: false,
      })

      if (unit == '%') {
        return `${100 * parsedWidth / groupWidth}px`
      } else {
        return `${parsedWidth}${unit}`
      }
    }

    return `
      <div
        ${this.htmlAttributes({
          'class': `${this.getColumnClass()} outlook-group-fix`,
          style: 'div',
        })}
      >
        <!--[if mso | IE]>
        <table  role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
        <![endif]-->
          ${this.renderChildren(children, {
            attributes: { mobileWidth: 'mobileWidth' },
            renderer: component => component.rawElement ? component.render() : `
              <!--[if mso | IE]>
              <td
                ${component.htmlAttributes({
                  style: {
                    align: component.getMjAttribute('align'),
                    width: getElementWidth(component.getMjAttribute('width'))
                  }
                })}
              >
              <![endif]-->
                ${component.render()}
              <!--[if mso | IE]>
              </td>
              <![endif]-->
          `})}
        <!--[if mso | IE]>
          </tr>
          </table>
        <![endif]-->
      </div>
    `
  }
}

