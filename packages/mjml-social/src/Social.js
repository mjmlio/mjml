import { createBodyComponent } from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-social', {
  allowedAttributes: {
    align: 'enum(left,right,center)',
    'border-radius': 'unit(px)',
    'container-background-color': 'color',
    color: 'color',
    'font-family': 'string',
    'font-size': 'unit(px,%)',
    'font-style': 'string',
    'font-weight': 'string',
    'inner-padding': 'unit(px,%)',
    'line-height': 'unit(px,%)',
    mode: 'enum(horizontal,vertical)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'table-layout': 'enum(auto,fixed)',
    'vertical-align': 'enum(top,bottom,middle)',
  },
  defaultAttributes: {
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
  },
  getStyles() {
    return {
      tableVertical: {
        margin: '0px',
      },
      tableHorizontal: {
        float: 'none',
        display: 'inline-table',
      },
    }
  },
  getSocialElementAttributes() {
    return [
      'border-radius',
      'color',
      'font-family',
      'font-size',
      'font-weight',
      'icon-size',
      'inner-padding',
      'line-height'].reduce((res, attr) => {
        res[attr] = this.getMjAttribute(attr)
        return res
      }, {})
  },
  renderHorizontal() {
    const { children } = this.props

    return `
     <!--[if mso | IE]>
      <table
        ${this.generateHtmlAttributes({
          align: this.getMjAttribute('align'),
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
        renderer: component => (`
            <!--[if mso | IE]>
              <td>
            <![endif]-->
              <table
                ${this.generateHtmlAttributes({
                  align: this.getMjAttribute('align'),
                  border: '0',
                  cellpadding: '0',
                  cellspacing: '0',
                  role: 'presentation',
                  style: 'tableHorizontal',
                })}
              >
                ${component.render()}
              </table>
            <!--[if mso | IE]>
              </td>
            <![endif]-->
          `
        ),
      })}
      <!--[if mso | IE]>
          </tr>
        </table>
      <![endif]-->
    `
  },
  renderVertical() {
    const { children } = this.props

    return `
      <table
        ${this.generateHtmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: 'tableVertical',
        })}
      >
        ${this.renderChildren(children, { attributes: this.getSocialElementAttributes() })}
      </table>
    `
  },
  render() {
    return `
      ${this.getMjAttribute('mode') == 'horizontal' ? this.renderHorizontal() : this.renderVertical()}
    `
  },
})
