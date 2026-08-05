import { BodyComponent } from 'mjml-core'
import { isNil } from 'lodash'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'

export default class MjSocial extends BodyComponent {
  static componentName = 'mj-social'

  static allowedAttributes = {
    align: 'enum(left,right,center)',
    border: 'string',
    'border-radius': 'string',
    color: 'color',
    'color--dark': 'color',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
    'font-family': 'string',
    'font-size': 'unit(px,rem)',
    'font-style': 'string',
    'font-weight': 'string',
    'icon-size': 'unit(px,%)',
    'icon-height': 'unit(px,%)',
    'icon-padding': 'unit(px,%){1,4}',
    'inner-padding': 'unit(px,%){1,4}',
    'line-height': 'unit(px,%,em,rem)',
    mode: 'enum(horizontal,vertical)',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'table-layout': 'enum(auto,fixed)',
    'text-decoration': 'string',
    'text-padding': 'unit(px,%){1,4}',
    'vertical-align': 'enum(top,bottom,middle)',
  }

  static defaultAttributes = {
    align: 'center',
    'border-radius': '3px',
    color: '#333333',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '16px',
    'icon-size': '20px',
    'inner-padding': null,
    'line-height': '150%',
    mode: 'horizontal',
    padding: '10px 25px',
    'text-decoration': 'none',
  }

  darkContainerClass = undefined

  getDarkContainerClass() {
    if (typeof this.darkContainerClass !== 'undefined') {
      return this.darkContainerClass
    }

    const darkContainerBg = this.attributes['container-background-color--dark']

    if (!darkContainerBg) {
      this.darkContainerClass = null
      return this.darkContainerClass
    }

    this.darkContainerClass = registerDarkModeRule(
      this.context && this.context.globalData,
      {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      },
    )

    return this.darkContainerClass
  }

  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const darkClass = this.getDarkContainerClass()
      return [base, darkClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
  }

  // eslint-disable-next-line class-methods-use-this
  getStyles() {
    return {
      tableVertical: {
        margin: '0px',
      },
    }
  }

  getSocialElementAttributes() {
    const base = {}
    if (this.getAttribute('inner-padding')) {
      base.padding = this.getAttribute('inner-padding')
    }

    return [
      'border',
      'border-radius',
      'color',
      'color--dark',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'icon-size',
      'icon-height',
      'icon-padding',
      'text-padding',
      'line-height',
      'text-decoration',
    ]
      .filter((e) => !isNil(this.getAttribute(e)))
      .reduce((res, attr) => {
        res[attr] = this.getAttribute(attr)
        return res
      }, base)
  }

  renderHorizontal() {
    const { children } = this.props

    return `
      ${msoConditionalTag(`<table
        ${this.htmlAttributes({
          align: this.getAttribute('align'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
        })}
      >
        <tr>
      `)}
      ${this.renderChildren(children, {
        attributes: this.getSocialElementAttributes(),
        renderer: (component) =>
          component.constructor.isRawElement()
            ? component.render()
            : `
            ${msoConditionalTag(`
              <td>
            `)}
              <table
                ${component.htmlAttributes({
                  align: this.getAttribute('align'),
                  border: '0',
                  cellpadding: '0',
                  cellspacing: '0',
                  role: 'none',
                  style: {
                    float: 'none',
                    display: 'inline-table',
                  },
                })}
              >
                ${component.render()}
              </table>
            ${msoConditionalTag(`
              </td>`)}
          `,
      })}
      ${msoConditionalTag(`
          </tr>
        </table>`)}`
  }

  renderVertical() {
    const { children } = this.props

    return `<table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
          style: 'tableVertical',
        })}
      >
        ${this.renderChildren(children, {
          attributes: this.getSocialElementAttributes(),
        })}
      </table>`
  }

  render() {
    return `
      ${
        this.getAttribute('mode') === 'horizontal'
          ? this.renderHorizontal()
          : this.renderVertical()
      }
    `
  }
}
