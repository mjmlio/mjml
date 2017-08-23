import { BodyComponent } from 'mjml-core'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'

export default class MjSpacer extends BodyComponent {
  static allowedAttributes = {
    border: 'unit(px)',
    'border-bottom': 'unit(px)',
    'border-left': 'unit(px)',
    'border-radius': 'unit(px)',
    'border-right': 'unit(px)',
    'border-top': 'unit(px)',
    'container-background-color': 'color',
    direction: 'enum(ltr,rtl)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'vertical-align': 'string',
    width: 'unit(px,%)',
  }

  static defaultAttributes = {}

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
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="${parseInt(height)}" style="vertical-align:top;height:${height};">
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

