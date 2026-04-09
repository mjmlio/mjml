import { BodyComponent } from 'mjml-core'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjSpacer extends BodyComponent {
  static componentName = 'mj-spacer'

  static allowedAttributes = {
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-right': 'string',
    'border-top': 'string',
    'container-background-color': 'color',
    'dark-container-background-color': 'color',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    height: 'unit(px,%)',
  }

  static defaultAttributes = {
    height: '20px',
  }

  darkContainerClass = undefined

  getDarkContainerClass() {
    if (typeof this.darkContainerClass !== 'undefined') {
      return this.darkContainerClass
    }

    const darkContainerBg = this.attributes['dark-container-background-color']

    if (!darkContainerBg) {
      this.darkContainerClass = null
      return this.darkContainerClass
    }

    this.darkContainerClass = registerDarkModeRule(
      this.context && this.context.globalData,
      {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      },
    )

    return this.darkContainerClass
  }

  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const darkClass = this.getDarkContainerClass()
      return [base, darkClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
  }

  getStyles() {
    return {
      div: {
        height: this.getAttribute('height'),
        'line-height': this.getAttribute('height'),
      },
    }
  }

  render() {
    return `
      <div
        ${this.htmlAttributes({
          style: 'div',
        })}
      >&#8202;</div>
    `
  }
}
