import { BodyComponent } from 'mjml-core'
import { isNil } from 'lodash'

export default class MjSocial extends BodyComponent {
  static componentName = 'mj-social'

  static allowedAttributes = {
    align: 'enum(left,right,center)',
    'border-radius': 'unit(px,%)',
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
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
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
     <!--[if mso | IE]>
      <table
        ${this.htmlAttributes({
          align: this.getAttribute('align'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
        })}
      >
        <tr>
      <![endif]-->
      ${this.renderChildren(children, {
        attributes: this.getSocialElementAttributes(),
        renderer: (component) =>
          component.constructor.isRawElement()
            ? component.render()
            : `
            <!--[if mso | IE]>
              <td>
            <![endif]-->
              <table
                ${component.htmlAttributes({
                  align: this.getAttribute('align'),
                  border: '0',
                  cellpadding: '0',
                  cellspacing: '0',
                  role: 'presentation',
                  style: {
                    float: 'none',
                    display: 'inline-table',
                  },
                })}
              >
                <tbody>
                  ${component.render()}
                </tbody>
              </table>
            <!--[if mso | IE]>
              </td>
            <![endif]-->
          `,
      })}
      <!--[if mso | IE]>
          </tr>
        </table>
      <![endif]-->
    `
  }

  renderVertical() {
    const { children } = this.props

    return `
      <table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: 'tableVertical',
        })}
      >
        <tbody>
          ${this.renderChildren(children, {
            attributes: this.getSocialElementAttributes(),
          })}
        </tbody>
      </table>
    `
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
