import { BodyComponent } from 'mjml-core'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'

export default class MjSpacer extends BodyComponent {
  static allowedAttributes = {
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-right': 'string',
    'border-top': 'string',
    'container-background-color': 'color',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%)',
    height: 'unit(px,%)',
  }

  static defaultAttributes = {
    height: '20px',
  }

  getStyles() {
    return {
      div: {
        height: this.getAttribute('height'),
      },
    }
  }

  render() {
    const height = this.getAttribute('height')

    return `
      ${conditionalTag(`
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="${parseInt(
          height,
          10,
        )}" style="vertical-align:top;height:${height};">
      `)}
      <div
        ${this.htmlAttributes({
          style: 'div',
        })}
      >
        &nbsp;
      </div>
      ${conditionalTag(`
        </td></tr></table>
      `)}
    `
  }
}
