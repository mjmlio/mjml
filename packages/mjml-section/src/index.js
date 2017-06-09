import { BodyComponent } from 'mjml-core'

export default class extends BodyComponent {

  static tagName = 'mj-section'

  // static allowedAttributes = {
  //   'background-color': 'color',
  //   'background-url': 'string',
  //   'background-repeat': 'enum(repeat/no-repeat)',
  //   'background-size': 'string',
  //   border: 'string',
  //   'border-bottom': 'string',
  //   'border-left': 'string',
  //   'border-radius': 'string',
  //   'border-right': 'string',
  //   'border-top': 'string',
  //   direction: 'enum(ltr,rtl)',
  //   'full-width': 'enum(full-width)',
  //   padding: 'unit(px,%){1,4}',
  //   'padding-top': 'unit(px,%)',
  //   'padding-bottom': 'unit(px,%)',
  //   'padding-left': 'unit(px,%)',
  //   'padding-right': 'unit(px,%)',
  //   'text-align': 'enum(left,center,right)',
  //   'text-padding': 'unit(px,%){1,4}',
  //   'vertical-align': 'enum(bottom,middle,top)',
  // }

  static defaultAttributes = {
    'background-repeat': 'repeat',
    'background-size': 'auto',
    direction: 'ltr',
    padding: '20px 0',
    'text-align': 'center',
    'text-padding': '4px 4px 4px 0',
    'vertical-align': 'top',
  }

  getStyles() {
    const {
      containerWidth,
    } = this.context

    const fullWidth = this.isFullWidth()

    const background = this.getAttribute('background-url') ? {
      background: `${this.getAttribute('background-color') || ''} url(${this.getAttribute('background-url')}) top center / ${this.getAttribute('background-size') || ''} ${this.getAttribute('background-repeat') || ''}`.trim(),
      'background-color': this.getAttribute('background-color'),
    } : {
      background: this.getAttribute('background-color'),
      'background-color': this.getAttribute('background-color'),
    }

    return {
      tableFullwidth: {
        ...(fullWidth ? background : {}),
        width: '100%',
        'border-radius': this.getAttribute('border-radius'),
      },
      table: {
        ...(fullWidth ? {} : background),
        width: '100%',
        'border-radius': this.getAttribute('border-radius'),
      },
      td: {
        border: this.getAttribute('border'),
        'border-bottom': this.getAttribute('border-bottom'),
        'border-left': this.getAttribute('border-left'),
        'border-right': this.getAttribute('border-right'),
        'border-top': this.getAttribute('border-top'),
        direction: this.getAttribute('direction'),
        'font-size': '0px',
        padding: this.getAttribute('padding'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-top': this.getAttribute('padding-top'),
        'text-align': this.getAttribute('text-align'),
        'vertical-align': this.getAttribute('vertical-align'),
      },
      div: {
        ...(fullWidth ? {} : background),
        Margin: '0px auto',
        'border-radius': this.getAttribute('border-radius'),
        'max-width': containerWidth,
      },
    }
  }

  hasBackground() {
    return this.getAttribute('background-url') !== null
  }

  isFullWidth() {
    return this.getAttribute('full-width') === 'full-width'
  }

  renderBefore() {
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
  }

  renderAfter() {
    return `
      <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
    `
  }

  renderWrappedChildren() {
    const {
      children,
    } = this.props

    return `
      ${this.renderChildren(children, {
        renderer: component => component.rawElement ? component.render() : `
          <!--[if mso | IE]>
            <td
              ${component.htmlAttributes({
                align: component.getAttribute('align'),
                style: 'td-outlook',
              })}
            >
          <![endif]-->
            ${component.render()}
          <!--[if mso | IE]>
            </td>
          <![endif]-->
        `,
      })}
    `
  }

  renderWithBackground(content) {
    const fullWidth = this.isFullWidth()

    const {
      containerWidth,
    } = this.context

    return `
      <!--[if mso | IE]>
        <v:rect ${this.htmlAttributes({
          style: fullWidth ? 'mso-width-percent:1000;' : `width:${containerWidth}`,
          'xmlns:v': 'urn:schemas-microsoft-com:vml',
          fill: 'true',
          stroke: 'false',
        })}>
        <v:fill ${this.htmlAttributes({
          origin: '0.5, 0',
          position: '0.5, 0',
          src: this.getAttribute('background-url'),
          color: this.getAttribute('background-color'),
          type: 'tile',
        })} />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
          ${content}
    <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
    <![endif]-->
    `
  }

  renderSection() {
    return `
      <div ${this.htmlAttributes({ style: 'div' })}>
        <table
          ${this.htmlAttributes({
            align: 'center',
            background: this.isFullWidth() ? null : this.getAttribute('background-url'),
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
            style: 'table',
          })}
        >
          <tbody>
            <tr>
              <td
                ${this.htmlAttributes({
                  style: 'td',
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
  }

  renderFullWidth() {
    return `
      <table
        ${this.htmlAttributes({
          align: 'center',
          background: this.getAttribute('background-url'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: 'tableFullwidth',
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
  }

  renderSimple() {
    const section = this.renderSection()

    return `
      ${this.renderBefore()}
      ${this.hasBackground() ? this.renderWithBackground(section) : section}
      ${this.renderAfter()}
    `
  }

  render() {
    return this.isFullWidth() ? this.renderFullWidth() : this.renderSimple()
  }

}
