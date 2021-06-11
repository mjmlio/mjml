import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjDivider extends BodyComponent {
  static componentName = 'mj-divider'

  static allowedAttributes = {
    'border-color': 'color',
    'border-style': 'string',
    'border-width': 'unit(px)',
    'container-background-color': 'color',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    width: 'unit(px,%)',
    align: 'enum(left,center,right)',
  }

  static defaultAttributes = {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    padding: '10px 25px',
    width: '100%',
    align: 'center',
  }

  getStyles() {
    let computeAlign = '0px auto'
    if (this.getAttribute('align') === 'left') {
      computeAlign = '0px'
    } else if (this.getAttribute('align') === 'right') {
      computeAlign = '0px 0px 0px auto'
    }
    const p = {
      'border-top': ['style', 'width', 'color']
        .map((attr) => this.getAttribute(`border-${attr}`))
        .join(' '),
      'font-size': '1px',
      margin: computeAlign,
      width: this.getAttribute('width'),
    }

    return {
      p,
      outlook: {
        ...p,
        width: this.getOutlookWidth(),
      },
    }
  }

  getOutlookWidth() {
    const { containerWidth } = this.context
    const paddingSize =
      this.getShorthandAttrValue('padding', 'left') +
      this.getShorthandAttrValue('padding', 'right')

    const width = this.getAttribute('width')

    const { parsedWidth, unit } = widthParser(width)

    switch (unit) {
      case '%': {
        const effectiveWidth = parseInt(containerWidth, 10) - paddingSize
        const percentMultiplier = parseInt(parsedWidth, 10) / 100
        return `${effectiveWidth * percentMultiplier}px`
      }
      case 'px':
        return width
      default:
        return `${parseInt(containerWidth, 10) - paddingSize}px`
    }
  }

  renderAfter() {
    return `
      <!--[if mso | IE]>
        <table
          ${this.htmlAttributes({
            align: this.getAttribute('align'),
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            style: 'outlook',
            role: 'presentation',
            width: this.getOutlookWidth(),
          })}
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
    `
  }

  render() {
    return `
      <p
        ${this.htmlAttributes({
          style: 'p',
        })}
      >
      </p>
      ${this.renderAfter()}
    `
  }
}
