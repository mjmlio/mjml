import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjGroup extends BodyComponent {
  static componentName = 'mj-group'

  static allowedAttributes = {
    'background-color': 'color',
    direction: 'enum(ltr,rtl)',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%)',
  }

  static defaultAttributes = {
    direction: 'ltr',
  }

  getChildContext() {
    const { containerWidth: parentWidth } = this.context
    const { nonRawSiblings, children } = this.props
    const paddingSize =
      this.getShorthandAttrValue('padding', 'left') +
      this.getShorthandAttrValue('padding', 'right')

    let containerWidth =
      this.getAttribute('width') ||
      `${parseFloat(parentWidth) / nonRawSiblings}px`

    const { unit, parsedWidth } = widthParser(containerWidth, {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      containerWidth = `${
        (parseFloat(parentWidth) * parsedWidth) / 100 - paddingSize
      }px`
    } else {
      containerWidth = `${parsedWidth - paddingSize}px`
    }

    return {
      ...this.context,
      containerWidth,
      nonRawSiblings: children.length,
    }
  }

  getStyles() {
    return {
      div: {
        'font-size': '0',
        'line-height': '0',
        'text-align': 'left',
        display: 'inline-block',
        width: '100%',
        direction: this.getAttribute('direction'),
        'vertical-align': this.getAttribute('vertical-align'),
        'background-color': this.getAttribute('background-color'),
      },
      tdOutlook: {
        'vertical-align': this.getAttribute('vertical-align'),
        width: this.getWidthAsPixel(),
      },
    }
  }

  getParsedWidth(toString) {
    const { nonRawSiblings } = this.props

    const width = this.getAttribute('width') || `${100 / nonRawSiblings}%`

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
      return `${(parseFloat(containerWidth) * parsedWidth) / 100}px`
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
    const { children, nonRawSiblings } = this.props

    const { containerWidth: groupWidth } = this.getChildContext()

    const { containerWidth } = this.context

    const getElementWidth = (width) => {
      if (!width) {
        return `${
          parseInt(containerWidth, 10) / parseInt(nonRawSiblings, 10)
        }px`
      }

      const { unit, parsedWidth } = widthParser(width, {
        parseFloatToInt: false,
      })

      if (unit === '%') {
        return `${(100 * parsedWidth) / groupWidth}px`
      }
      return `${parsedWidth}${unit}`
    }

    let classesName = `${this.getColumnClass()} mj-outlook-group-fix`

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
        <table
          ${this.htmlAttributes({
            bgcolor:
              this.getAttribute('background-color') === 'none'
                ? undefined
                : this.getAttribute('background-color'),
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
          })}
        >
          <tr>
        <![endif]-->
          ${this.renderChildren(children, {
            attributes: { mobileWidth: 'mobileWidth' },
            renderer: (component) =>
              component.constructor.isRawElement()
                ? component.render()
                : `
              <!--[if mso | IE]>
              <td
                ${component.htmlAttributes({
                  style: {
                    align: component.getAttribute('align'),
                    'vertical-align': component.getAttribute('vertical-align'),
                    width: getElementWidth(
                      component.getWidthAsPixel
                        ? component.getWidthAsPixel()
                        : component.getAttribute('width'),
                    ),
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
