import { BodyComponent } from 'mjml-core'
import url from 'url'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'

export default class MjNavbarLink extends BodyComponent {
  static endingTag = true

  static allowedAttributes = {
    color: 'color',
    'font-family': 'string',
    'font-size': 'unit(px,%)',
    'font-weight': 'string',
    href: 'string',
    target: 'string',
    rel: 'string',
    'line-height': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'text-decoration': 'string',
    'text-transform': 'string',
  }

  static defaultAttributes = {
    color: '#000000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'font-weight': 'normal',
    'line-height': '22px',
    padding: '15px 10px',
    target: '_blank',
    'text-decoration': 'none',
    'text-transform': 'uppercase',
  }

  getStyles() {
    return {
      a: {
        display: 'inline-block',
        color: this.getAttribute('color'),
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'font-weight': this.getAttribute('font-weight'),
        'line-height': this.getAttribute('line-height'),
        'text-decoration': this.getAttribute('text-decoration'),
        'text-transform': this.getAttribute('text-transform'),
        padding: this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
      },
      td: {
        padding: this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
      }
    }
  }

  renderContent() {
    const href = this.getAttribute('href')
    const navbarBaseUrl = this.getAttribute('navbarBaseUrl')
    const link = navbarBaseUrl ? url.resolve(navbarBaseUrl, href) : href

    const cssClass = this.getAttribute('css-class')
      ? ` ${this.getAttribute('css-class')}`
      : ''

    return `
      <a
        ${this.htmlAttributes({
          class: `mj-link${cssClass}`,
          href: link,
          rel: this.getAttribute('rel'),
          target: this.getAttribute('target'),
          style: 'a',
        })}
      >
        ${this.getContent()}
      </a>
    `
  }

  render() {
    return `
        ${conditionalTag(`
          <td
            ${this.htmlAttributes({
              style: 'td',
              class: this.getAttribute('css-class')
                ? this.getAttribute('css-class')
                    .split(' ')
                    .map(c => `${c}-outlook`)
                    .join(' ')
                : null,
            })}
          >
        `)}
        ${this.renderContent()}
        ${conditionalTag(`
          </td>
        `)}
      `
  }
}
