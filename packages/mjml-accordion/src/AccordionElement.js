import { BodyComponent } from 'mjml-core'
import { find } from 'lodash'
import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
} from 'mjml-core/lib/helpers/responsiveMode'
import AccordionText from './AccordionText'
import AccordionTitle from './AccordionTitle'

export default class MjAccordionElement extends BodyComponent {
  static componentName = 'mj-accordion-element'

  static allowedAttributes = {
    'background-color': 'color',
    'background-color--dark': 'color',
    border: 'string',
    'border-color--dark': 'color',
    'font-family': 'string',
    'icon-align': 'enum(top,middle,bottom)',
    'icon-height': 'unit(px,%)',
    'icon-height--responsive': 'unit(px,%)',
    'icon-position': 'enum(left,right)',
    'icon-unwrapped-alt': 'string',
    'icon-unwrapped-url': 'string',
    'icon-unwrapped-url--dark': 'string',
    'icon-width': 'unit(px,%)',
    'icon-width--responsive': 'unit(px,%)',
    'icon-wrapped-alt': 'string',
    'icon-wrapped-url': 'string',
    'icon-wrapped-url--dark': 'string',
  }

  static defaultAttributes = {
    title: {
      img: {
        width: '32px',
        height: '32px',
      },
    },
  }

  darkClasses = null

  responsiveClasses = null

  getDarkClasses() {
    if (this.darkClasses !== null) {
      return this.darkClasses
    }

    this.darkClasses = {}

    const globalData = this.context && this.context.globalData

    const darkBackgroundColor = this.getAttribute('background-color--dark')
    if (darkBackgroundColor) {
      this.darkClasses.background = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkBackgroundColor,
      })
    }

    return this.darkClasses
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    emitResponsiveHeadStyle(this.context && this.context.globalData)
    return ''
  }

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) {
      return this.responsiveClasses
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses = {
      icon: registerResponsiveRuleGroup(globalData, {
        cssDeclarations: buildResponsiveDeclarations([
          ['width', this.attributes['icon-width--responsive']],
          ['height', this.attributes['icon-height--responsive']],
        ]),
      }),
    }

    return this.responsiveClasses
  }

  getStyles() {
    return {
      td: {
        'background-color': this.getAttribute('background-color'),
      },
      label: {
        'font-family': this.getAttribute('font-family'),
      },
      input: {
        display: 'none',
      },
    }
  }

  handleMissingChildren() {
    const { children } = this.props
    const childrenAttr = [
      'border',
      'icon-align',
      'icon-width',
      'icon-width--responsive',
      'icon-height',
      'icon-height--responsive',
      'icon-position',
      'icon-wrapped-url',
      'icon-wrapped-alt',
      'icon-unwrapped-url',
      'icon-unwrapped-alt',
      'icon-wrapped-url--dark',
      'icon-unwrapped-url--dark',
      'border-color--dark',
    ].reduce(
      (res, val) => ({
        ...res,
        [val]: this.getAttribute(val),
      }),
      {},
    )

    const result = []

    if (!find(children, { tagName: 'mj-accordion-title' })) {
      result.push(
        new AccordionTitle({
          attributes: childrenAttr,
          context: this.getChildContext(),
        }).render(),
      )
    }

    result.push(this.renderChildren(children, { attributes: childrenAttr }))

    if (!find(children, { tagName: 'mj-accordion-text' })) {
      result.push(
        new AccordionText({
          attributes: childrenAttr,
          context: this.getChildContext(),
        }).render(),
      )
    }

    return result.join('\n')
  }

  getChildContext() {
    return {
      ...this.context,
      accordionIconResponsiveClass: this.getResponsiveClasses().icon,
      elementFontFamily: this.getAttribute('font-family'),
    }
  }

  render() {
    const backgroundDarkClass = this.getDarkClasses().background

    return `
      <tr
        ${this.htmlAttributes({
          class: this.getAttribute('css-class'),
        })}
      >
        <td
          ${this.htmlAttributes({
            style: 'td',
            class: backgroundDarkClass || undefined,
          })}
        >
          <label
            ${this.htmlAttributes({
              class: 'mj-accordion-element',
              style: 'label',
            })}
          >
            ${conditionalTag(
              `
              <input
                ${this.htmlAttributes({
                  class: 'mj-accordion-checkbox',
                  type: 'checkbox',
                  style: 'input',
                })}
              />
            `,
              true,
            )}
            <div>
              ${this.handleMissingChildren()}
            </div>
          </label>
        </td>
      </tr>`
  }
}
