import { BodyComponent } from 'mjml-core'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
  registerResponsivePaddingGroup,
} from 'mjml-core/lib/helpers/responsiveMode'

export default class MjSpacer extends BodyComponent {
  static componentName = 'mj-spacer'

  static allowedAttributes = {
    'aria-hidden': 'string',
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-right': 'string',
    'border-top': 'string',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
    'container-border-radius': 'string',
    height: 'unit(px,%)',
    'height--responsive': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'padding--responsive': 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-bottom--responsive': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-left--responsive': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-right--responsive': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding-top--responsive': 'unit(px,%)',
  }

  static defaultAttributes = {
    'aria-hidden': 'true',
    height: '20px',
  }

  darkContainerClass = undefined

  responsiveClasses = null

  getDarkContainerClass() {
    if (typeof this.darkContainerClass !== 'undefined') {
      return this.darkContainerClass
    }

    const darkContainerBg = this.attributes['container-background-color--dark']

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

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) return this.responsiveClasses

    this.responsiveClasses = {
      container: null,
      div: null,
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses.container = registerResponsivePaddingGroup(globalData, this.attributes)

    const heightResponsive = this.attributes['height--responsive']
    if (heightResponsive) {
      this.responsiveClasses.div = registerResponsiveRuleGroup(globalData, {
        cssDeclarations: buildResponsiveDeclarations([
          ['height', heightResponsive],
          ['line-height', heightResponsive],
        ]),
      })
    }

    return this.responsiveClasses
  }

  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const darkClass = this.getDarkContainerClass()
      const containerResponsiveClass = this.getResponsiveClasses().container
      return [base, darkClass, containerResponsiveClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    emitResponsiveHeadStyle(this.context && this.context.globalData)
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
    const divResponsiveClass = this.getResponsiveClasses().div

    return `
      <div
        ${this.htmlAttributes({
          'aria-hidden': this.getAttribute('aria-hidden'),
          style: 'div',
          class: divResponsiveClass || null,
        })}
      >&#8202;</div>
    `
  }
}
