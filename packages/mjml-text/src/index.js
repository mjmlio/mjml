import { BodyComponent } from 'mjml-core'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjText extends BodyComponent {
  static componentName = 'mj-text'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,right,center,justify)',
    color: 'color',
    'container-background-color': 'color',
    'dark-color': 'color',
    'dark-container-background-color': 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-style': 'string',
    'font-weight': 'string',
    height: 'unit(px,%)',
    'letter-spacing': 'unitWithNegative(px,em)',
    'line-height': 'unit(px,%,)',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'text-decoration': 'string',
    'text-transform': 'string',
    'vertical-align': 'enum(top,bottom,middle)',
  }

  // Lazily register both dark-mode rules on first access so the sequential
  // counter is stable regardless of whether getAttribute or renderContent runs first.
  darkClasses = null

  getDarkClasses() {
    if (this.darkClasses !== null) return this.darkClasses
    this.darkClasses = {}
    const globalData = this.context && this.context.globalData

    const darkContainerBg = this.attributes['dark-container-background-color']
    if (darkContainerBg) {
      this.darkClasses.container = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      })
    }

    const darkColor = this.attributes['dark-color']
    if (darkColor) {
      this.darkClasses.color = registerDarkModeRule(globalData, {
        cssProperty: 'color',
        cssValue: darkColor,
      })
    }

    return this.darkClasses
  }

  // Merge the container dark class into css-class so the parent column applies
  // it to the wrapping <td> element (which is where container-background-color
  // is rendered as an inline style).
  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const containerDarkClass = this.getDarkClasses().container
      return [base, containerDarkClass].filter(Boolean).join(' ') || undefined
    }
    return this.attributes[name]
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
  }

  static defaultAttributes = {
    align: 'left',
    color: '#000000',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '13px',
    'line-height': '1',
    padding: '10px 25px',
  }

  getStyles() {
    return {
      text: {
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'font-style': this.getAttribute('font-style'),
        'font-weight': this.getAttribute('font-weight'),
        'letter-spacing': this.getAttribute('letter-spacing'),
        'line-height': this.getAttribute('line-height'),
        'text-align': this.getAttribute('align'),
        'text-decoration': this.getAttribute('text-decoration'),
        'text-transform': this.getAttribute('text-transform'),
        color: this.getAttribute('color'),
        height: this.getAttribute('height'),
      },
    }
  }

  renderContent() {
    const colorDarkClass = this.getDarkClasses().color
    return `<div
        ${this.htmlAttributes({
          style: 'text',
          class: colorDarkClass || null,
        })}
      >${this.getContent()}</div>`
  }

  render() {
    const height = this.getAttribute('height')

    const supportOutlookClassic =
      !this.context ||
      !this.context.globalData ||
      this.context.globalData.supportOutlookClassic !== false

    if (!height || !supportOutlookClassic) {
      return this.renderContent()
    }

    return `${conditionalTag(`<table role="none" border="0" cellpadding="0" cellspacing="0"><tr><td height="${height}" style="vertical-align:top;height:${height};">`)}
        ${this.renderContent()}
        ${conditionalTag(`</td></tr></table>`)}
      `
  }
}
