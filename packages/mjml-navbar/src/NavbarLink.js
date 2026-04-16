import { BodyComponent, suffixCssClasses } from 'mjml-core'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjNavbarLink extends BodyComponent {
  static componentName = 'mj-navbar-link'

  static endingTag = true

  static allowedAttributes = {
    color: 'color',
    'dark-color': 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-style': 'string',
    'font-weight': 'string',
    href: 'string',
    'letter-spacing': 'unitWithNegative(px,em)',
    'line-height': 'unit(px,%,)',
    name: 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    rel: 'string',
    target: 'string',
    'text-decoration': 'string',
    'text-transform': 'string',
  }

  static defaultAttributes = {
    color: '#000000',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    padding: '15px 10px',
    'text-decoration': 'none',
    'text-transform': 'uppercase',
  }

  darkClasses = null

  getDarkClasses() {
    if (this.darkClasses !== null) {
      return this.darkClasses
    }

    this.darkClasses = {}

    const globalData = this.context && this.context.globalData

    const darkColor = this.getAttribute('dark-color')
    if (darkColor) {
      this.darkClasses.color = registerDarkModeRule(globalData, {
        cssProperty: 'color',
        cssValue: darkColor,
      })
    }

    return this.darkClasses
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
  }

  getStyles() {
    return {
      a: {
        display: 'inline-block',
        color: this.getAttribute('color'),
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'font-style': this.getAttribute('font-style'),
        'font-weight': this.getAttribute('font-weight'),
        'letter-spacing': this.getAttribute('letter-spacing'),
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
      },
    }
  }

  renderContent() {
    const href = this.getAttribute('href')
    const navbarBaseUrl = this.getAttribute('navbarBaseUrl')
    const link = navbarBaseUrl ? `${navbarBaseUrl}${href}` : href

    const cssClass = this.getAttribute('css-class')
      ? ` ${this.getAttribute('css-class')}`
      : ''
    
    const darkClass = this.getDarkClasses().color ? ` ${this.getDarkClasses().color}` : ''

    return `
      <a
        ${this.htmlAttributes({
          class: `mj-link${cssClass}${darkClass}`,
          href: link,
          rel: this.getAttribute('rel'),
          target: this.getAttribute('target'),
          name: this.getAttribute('name'),
          style: 'a',
        })}
      >
        ${this.getContent()}
      </a>
    `
  }

  render() {
    const supportOutlookClassic =
      !this.context ||
      !this.context.globalData ||
      this.context.globalData.supportOutlookClassic !== false

    if (!supportOutlookClassic) {
      return this.renderContent()
    }

    return `
        ${conditionalTag(`
          <td
            ${this.htmlAttributes({
              style: 'td',
              class: suffixCssClasses(
                this.getAttribute('css-class'),
                'outlook',
              ),
            })}>`)}
        ${this.renderContent()}
        ${conditionalTag(`</td>`)}
      `
  }
}
