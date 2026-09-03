import { BodyComponent } from 'mjml-core'
import { isNil } from 'lodash'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
} from 'mjml-core/lib/helpers/responsiveMode'
import { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'

export default class MjSocial extends BodyComponent {
  static componentName = 'mj-social'

  static allowedAttributes = {
    align: 'enum(left,right,center)',
    'align--responsive': 'enum(left,right,center)',
    border: 'string',
    'border-radius': 'string',
    color: 'color',
    'color--dark': 'color',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
    'container-border-radius': 'string',
    'font-family': 'string',
    'font-size': 'unit(px,rem)',
    'font-size--responsive': 'unit(px,rem)',
    'font-style': 'string',
    'font-weight': 'string',
    'gutter': 'unit(px){1,4}',
    'gutter--responsive': 'unit(px){1,4}',
    'icon-size': 'unit(px,%)',
    'icon-size--responsive': 'unit(px,%)',
    'icon-height': 'unit(px,%)',
    'icon-height--responsive': 'unit(px,%)',
    'icon-padding': 'unit(px,%){1,4}',
    'icon-padding--responsive': 'unit(px,%){1,4}',
    'line-height': 'unit(px,%,em,rem)',
    'line-height--responsive': 'unit(px,%,em,rem)',
    mode: 'enum(horizontal,vertical)',
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
    'responsive-mode': 'enum(stack)',
    'table-layout': 'enum(auto,fixed)',
    'text-decoration': 'string',
    'text-spacing': 'unit(px){1,4}',
    'text-spacing--responsive': 'unit(px){1,4}',
    'vertical-align': 'enum(top,bottom,middle)',
  }

  static defaultAttributes = {
    align: 'center',
    'border-radius': '3px',
    color: '#333333',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '16px',
    'icon-size': '20px',
    'gutter': null,
    'line-height': '150%',
    mode: 'horizontal',
    padding: '10px 25px',
    'text-decoration': 'none',
    'text-spacing': '4px 4px 4px 0',
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

    this.responsiveClasses = { container: null }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses.container = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['padding', this.attributes['padding--responsive']],
        ['padding-top', this.attributes['padding-top--responsive']],
        ['padding-right', this.attributes['padding-right--responsive']],
        ['padding-bottom', this.attributes['padding-bottom--responsive']],
        ['padding-left', this.attributes['padding-left--responsive']],
        ['text-align', this.attributes['align--responsive']],
      ]),
    })

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
    const globalData = this.context && this.context.globalData
    emitDarkModeHeadStyle(globalData)
    emitResponsiveHeadStyle(globalData)

    if (globalData && globalData.hasSocialStack && !globalData.socialStackStyleEmitted) {
      globalData.socialStackStyleEmitted = true
      globalData.headRaw.push(`<style>
  @media only screen and (max-width:479px) {
    .mj-social-stack {
      display: table !important;
      float: none !important;
    }
  }
</style>`)
    }

    return ''
  }

  // eslint-disable-next-line class-methods-use-this
  getStyles() {
    return {
      tableVertical: {
        margin: '0px',
      },
    }
  }

  getSocialElementAttributes() {
    const base = {}
    if (this.getAttribute('gutter')) {
      base.padding = this.getAttribute('gutter')
    }
    if (this.attributes['gutter--responsive']) {
      base['padding--responsive'] = this.attributes['gutter--responsive']
    }
    return [
      'align--responsive',
      'border',
      'border-radius',
      'color',
      'color--dark',
      'font-family',
      'font-size',
      'font-size--responsive',
      'font-style',
      'font-weight',
      'icon-height',
      'icon-height--responsive',
      'icon-padding',
      'icon-padding--responsive',
      'icon-size',
      'icon-size--responsive',
      'line-height',
      'line-height--responsive',
      'mode',
      'text-decoration',
      'text-spacing',
      'text-spacing--responsive',
    ]
      .filter((e) => !isNil(this.getAttribute(e)))
      .reduce((res, attr) => {
        res[attr] = this.getAttribute(attr)
        return res
      }, base)
  }

  renderHorizontal() {
    const { children } = this.props
    const isStack = this.getAttribute('responsive-mode') === 'stack'
    const globalData = this.context && this.context.globalData

    if (isStack && globalData) {
      globalData.hasSocialStack = true
    }

    return `
      ${msoConditionalTag(`<table
        ${this.htmlAttributes({
          align: this.getAttribute('align'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
        })}
      >
        <tr>
      `)}
      ${this.renderChildren(children, {
        attributes: this.getSocialElementAttributes(),
        renderer: (component) =>
          component.constructor.isRawElement()
            ? component.render()
            : `
            ${msoConditionalTag(`
              <td>
            `)}
              <table
                ${component.htmlAttributes({
                  align: this.getAttribute('align'),
                  border: '0',
                  cellpadding: '0',
                  cellspacing: '0',
                  role: 'none',
                  style: {
                    float: 'none',
                    display: 'inline-table',
                  },
                  class: isStack ? 'mj-social-stack' : null,
                })}
              >
                ${component.render()}
              </table>
            ${msoConditionalTag(`
              </td>`)}
          `,
      })}
      ${msoConditionalTag(`
          </tr>
        </table>`)}`
  }

  renderVertical() {
    const { children } = this.props

    return `<table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'none',
          style: 'tableVertical',
        })}
      >
        ${this.renderChildren(children, {
          attributes: this.getSocialElementAttributes(),
        })}
      </table>`
  }

  render() {
    return `
      ${
        this.getAttribute('mode') === 'horizontal'
          ? this.renderHorizontal()
          : this.renderVertical()
      }
    `
  }
}
