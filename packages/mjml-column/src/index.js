import _ from 'lodash'

import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default createBodyComponent('mj-column', {
  getChildContext () {
    const {
      containerWidth,
    } = this.context
    const {
      sibling,
    } = this.props

    const columnWidth = this.getMjAttribute('width') || `${parseFloat(containerWidth) / sibling}`

    return {
      ...this.context,
      columnWidth,
    }
  },
  getStyles () {
    return {
      div: {
        'font-size': '13px',
        'text-align': 'left',
        'vertical-align': 'top',
        direction: 'ltr',
        display: 'inline-block',
      },
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
    const {
      sibling,
    } = this.props

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
  renderBefore () {
    return `
      <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:${this.getParsedWidth(true)};">
      <![endif]-->
    `
  },
  renderAfter () {
    return `
      <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
    `
  },
  render () {
    const {
      children,
    } = this.props

    return `
      ${this.renderBefore()}
      <div
        ${this.generateHtmlAttributes({
          'class': `${this.getColumnClass()} outlook-group-fix`,
          style: this.generateStyles('div'),
        })}
      >
        <table
          ${this.generateHtmlAttributes({
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
            width: '100%',
          })}
        >
          <tbody>
            ${this.renderChildren(children, {
              renderer: component => `
                <tr>
                  <td
                    ${component.generateHtmlAttributes({
                      align: component.getMjAttribute('align'),
                      background: component.getMjAttribute('container-background-color'),
                      style: component.generateStyles({
                        background: component.getMjAttribute('container-background-color'),
                        'font-size': '0px',
                        padding: component.getMjAttribute('padding'),
                        'padding-top': component.getMjAttribute('padding-top'),
                        'padding-right': component.getMjAttribute('padding-right'),
                        'padding-bottom': component.getMjAttribute('padding-bottom'),
                        'padding-left': component.getMjAttribute('padding-left'),
                        'word-break': 'break-word',
                      }),
                    })}
                  >
                    ${component.render()}
                  </td>
                </tr>
              `
            })}
          </tbody>
        </table>
      </div>
      ${this.renderAfter()}
    `
  }
})
