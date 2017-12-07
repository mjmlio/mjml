import { BodyComponent } from 'mjml-core'
import url from 'url'
import { merge } from 'lodash'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'

const baseStyles = {
  a: {
    display: 'inline-block',
    'text-decoration': 'none',
    'text-transform': 'uppercase'
  }
}

export default class MjNavbarLink extends BodyComponent {
  static endingTag = true

  static allowedAttributes = {
    color: 'color',
    'font-family': 'string',
    'font-size': 'unit(px,%)',
    'font-weight': 'string',
    href: 'string',
    rel: 'string',
    'line-height': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'text-decoration': 'string',
    'text-transform': 'string'
  }

  static defaultAttributes = {
    'color': '#000000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'font-weight': 'normal',
    'line-height': '22px',
    'padding': '15px 10px'
  }

  getStyles () {
    return merge({}, baseStyles, {
      a: {
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
        'padding-bottom': this.getAttribute('padding-bottom')
      }
    })
  }

  renderContent() {
    const href = this.getAttribute('href')
    const rel = this.getAttribute('rel')
    const navbarBaseUrl = this.getAttribute('navbarBaseUrl')
    const link = navbarBaseUrl
               ? url.resolve(navbarBaseUrl, href)
               : href

    return `
      <a
        ${this.htmlAttributes({
          href: link,
          rel,
          style: 'a'
        })}
      >
        ${this.getContent()}
      </a>
    `
  }

  render() {
    const padding = this.getAttribute('padding')
    const height = this.getAttribute('height')

    return height
      ? `
        ${conditionalTag(`
          <td style="padding: ${padding}">
        `)}
        ${this.renderContent()}
        ${conditionalTag(`
          </td>
        `)}
      `
      : this.renderContent()
  }

}
