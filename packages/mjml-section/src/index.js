import cloneDeep from 'lodash/cloneDeep'
import {
  createBodyComponent,
} from 'mjml-core/lib/createComponent'

export default createBodyComponent('mj-section', {
  allowedAttributes: {
    'background-color': 'color',
    'background-url': 'string',
    'background-repeat': 'enum(repeat/no-repeat)',
    'background-size': 'string',
    'border': 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-radius': 'string',
    'border-right': 'string',
    'border-top': 'string',
    'direction': 'enum(ltr,rtl)',
    'full-width': 'enum(full-width)',
    'padding': 'unit(px,%){1,4}',
    'padding-top': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'text-align': 'enum(left,center,right)',
    'vertical-align': 'enum(bottom,middle,top)',
  },
  defaultAttributes: {
    'background-repeat': 'repeat',
    'background-size': 'auto',
    'direction': 'ltr',
    'padding': '20px 0',
    'text-align': 'center',
    'vertical-align': 'top',
  },
  getStyles () {
    const {
      containerWidth,
    } = this.context

    const fullWidth = this.isFullWidth()

    const background = this.getMjAttribute('background-url') ? {
      'background': `${this.getMjAttribute('background-color') || ''} url(${this.getMjAttribute('background-url')}) top center / ${this.getMjAttribute('background-size') || ''} ${this.getMjAttribute('background-repeat') || ''}`.trim(),
      'background-color': this.getMjAttribute('background-color'),
    } : {
      'background': this.getMjAttribute('background-color'),
      'background-color': this.getMjAttribute('background-color'),
    }

    return {
      tableFullwidth: {
        ...(fullWidth ? cloneDeep(background) : {}),
        'width': '100%',
        'border-radius': this.getMjAttribute('border-radius'),
      },
      table: {
        ...(fullWidth ? {} : cloneDeep(background)),
        'width': '100%',
        'border-radius': this.getMjAttribute('border-radius'),
      },
      td: {
        'border': this.getMjAttribute('border'),
        'border-bottom': this.getMjAttribute('border-bottom'),
        'border-left': this.getMjAttribute('border-left'),
        'border-right': this.getMjAttribute('border-right'),
        'border-top': this.getMjAttribute('border-top'),
        'direction': this.getMjAttribute('direction'),
        'font-size': '0px',
        'padding': this.getMjAttribute('padding'),
        'padding-bottom': this.getMjAttribute('padding-bottom'),
        'padding-left': this.getMjAttribute('padding-left'),
        'padding-right': this.getMjAttribute('padding-right'),
        'padding-top': this.getMjAttribute('padding-top'),
        'text-align': this.getMjAttribute('text-align'),
        'vertical-align': this.getMjAttribute('vertical-align')
      },
      div: {
        ...(fullWidth ? {} : cloneDeep(background)),
        'Margin': '0px auto',
        'border-radius': this.getMjAttribute('border-radius'),
        'max-width': containerWidth,
      }
    }
  },
  hasBackground () {
    return this.getMjAttribute('background-url') != null
  },
  isFullWidth () {
    return this.getMjAttribute('full-width') == 'full-width'
  },
  renderBefore () {
    const {
      containerWidth,
    } = this.context

    return `
      <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${parseFloat(containerWidth)}" align="center" style="width:${containerWidth};">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
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
  renderWrappedChildren () {
    const {
      children,
    } = this.props

    return `
      ${this.renderChildren(children, {
        renderer: (component) => component.rawElement ? component.render() : `
          <!--[if mso | IE]>
            <td ${this.generateHtmlAttributes({ style: this.generateStyles('td-outlook') })}>
          <![endif]-->
            ${component.render()}
          <!--[if mso | IE]>
            </td>
          <![endif]-->
        `
      })}
    `
  },
  renderWithBackground (content) {
    const fullWidth = this.isFullWidth()
    const {
      containerWidth,
    } = this.context

    return `
      <!--[if mso | IE]>
        <v:rect ${this.generateHtmlAttributes({
          'style': fullWidth ? 'mso-width-percent:1000;' : `width:${containerWidth}`,
          'xmlns:v': 'urn:schemas-microsoft-com:vml',
          'fill': 'true',
          'stroke': 'false',
        })}>
        <v:fill ${this.generateHtmlAttributes({
          'origin': '0.5, 0',
          'position': '0.5, 0',
          'src': this.getMjAttribute('background-url'),
          'color': this.getMjAttribute('background-color'),
          'type': 'tile',
        })} />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
          ${content}
    <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
    <![endif]-->
    `
  },
  renderSection () {
    const {
      children,
    } = this.props

    return `
      <div
        ${this.generateHtmlAttributes({
          style: this.generateStyles('div'),
        })}
      >
        <table
          ${this.generateHtmlAttributes({
            align: 'center',
            background: this.isFullWidth() ? null : this.getMjAttribute('background-url'),
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
            style: this.generateStyles('table'),
          })}
        >
          <tbody>
            <tr>
              <td
                ${this.generateHtmlAttributes({
                  style: this.generateStyles('td'),
                })}
              >
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                <![endif]-->
                  ${this.renderWrappedChildren()}
                <!--[if mso | IE]>
                    </tr>
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  renderFullWidth () {
    return `
      <table
        ${this.generateHtmlAttributes({
          align: 'center',
          background: this.getMjAttribute('background-url'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: this.generateStyles('tableFullwidth'),
        })}
      >
        <tbody>
          <tr>
            <td>
              ${this.hasBackground() ? this.renderWithBackground(`
                ${this.renderBefore()}
                ${this.renderSection()}
                ${this.renderAfter()}
              `) : `
                ${this.renderBefore()}
                ${this.renderSection()}
                ${this.renderAfter()}
              `}
            </td>
          </tr>
        </tbody>
      </table>
    `
  },
  renderSimple () {
    const section = this.renderSection()

    return `
      ${this.renderBefore()}
      ${this.hasBackground() ? this.renderWithBackground(section) : section}
      ${this.renderAfter()}
    `
  },
  render () {
    return this.isFullWidth() ? this.renderFullWidth() : this.renderSimple()
  }
})
