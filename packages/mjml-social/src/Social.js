import { BodyComponent } from 'mjml-core'
import { isNil } from 'lodash'
import { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'

export default class MjSocial extends BodyComponent {
  static componentName = 'mj-social'

  static allowedAttributes = {
    align: 'enum(left,right,center)',
    'border-radius': 'string',
    'container-background-color': 'color',
    color: 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-style': 'string',
    'font-weight': 'string',
    'icon-size': 'unit(px,%)',
    'icon-height': 'unit(px,%)',
    'icon-padding': 'unit(px,%){1,4}',
    'inner-padding': 'unit(px,%){1,4}',
    'line-height': 'unit(px,%,)',
    mode: 'enum(horizontal,vertical)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'table-layout': 'enum(auto,fixed)',
    'text-padding': 'unit(px,%){1,4}',
    'text-decoration': 'string',
    'vertical-align': 'enum(top,bottom,middle)',
  }

  static defaultAttributes = {
    align: 'center',
    'border-radius': '3px',
    color: '#333333',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '13px',
    'icon-size': '20px',
    'inner-padding': null,
    'line-height': '22px',
    mode: 'horizontal',
    padding: '10px 25px',
    'text-decoration': 'none',
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
      'border-radius',
      'color',
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
