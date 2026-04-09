import { BodyComponent } from 'mjml-core'
import { flow, identity, join, filter } from 'lodash/fp'

import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import { OUTLOOK_DARK_MODE_CLASS } from 'mjml-core/lib/helpers/outlookDarkMode'

import widthParser from 'mjml-core/lib/helpers/widthParser'
import { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'

const makeBackgroundString = flow(filter(identity), join(' '))

export default class MjHero extends BodyComponent {
  static componentName = 'mj-hero'

  static allowedAttributes = {
    'background-color': 'color',
    'background-height': 'unit(px,%)',
    'background-position': 'string',
    'background-url': 'string',
    'background-width': 'unit(px,%)',
    'border-radius': 'string',
    'dark-background-color': 'color',
    'dark-background-url': 'string',
    'dark-inner-background-color': 'color',
    height: 'unit(px,%)',
    'inner-background-color': 'color',
    'inner-padding': 'unit(px,%){1,4}',
    'inner-padding-top': 'unit(px,%)',
    'inner-padding-left': 'unit(px,%)',
    'inner-padding-right': 'unit(px,%)',
    'inner-padding-bottom': 'unit(px,%)',
    mode: 'string',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'vertical-align': 'enum(top,bottom,middle)',
  }

  static defaultAttributes = {
    mode: 'fixed-height',
    height: '0px',
    'background-position': 'center',
    'background-color': '#ffffff',
    'vertical-align': 'top',
  }

  darkClasses = null

  registerDarkBackgroundImageClass() {
    const globalData = this.context && this.context.globalData

    if (!globalData) {
      return null
    }

    if (typeof globalData.outlookDarkModeImageCount !== 'number') {
      globalData.outlookDarkModeImageCount = 0
    }

    globalData.outlookDarkModeImageCount += 1

    return `${OUTLOOK_DARK_MODE_CLASS}-${globalData.outlookDarkModeImageCount}`
  }

  getDarkBackgroundImageCssValue() {
    const darkBackgroundUrl = this.getAttribute('dark-background-url')

    return darkBackgroundUrl ? `url(${JSON.stringify(darkBackgroundUrl)})` : null
  }

  componentHeadStyle = () => {
    const {
      backgroundClass,
      backgroundImageClass,
      innerBackgroundClass,
    } = this.getDarkClasses()
    const styles = []

    if (backgroundClass || innerBackgroundClass) {
      emitDarkModeHeadStyle(this.context && this.context.globalData)
    }

    if (backgroundImageClass) {
      const backgroundImageCssValue = this.getDarkBackgroundImageCssValue()

      styles.push(`
@media (prefers-color-scheme: dark) {
  .${backgroundImageClass} { background-image: ${backgroundImageCssValue} !important; }
}
`)
    }

    return styles.join('\n')
  }

  getDarkClasses() {
    if (this.darkClasses) {
      return this.darkClasses
    }

    this.darkClasses = {
      backgroundClass: this.getAttribute('dark-background-color')
        ? registerDarkModeRule(this.context && this.context.globalData, {
            cssProperty: 'background-color',
            cssValue: this.getAttribute('dark-background-color'),
          })
        : null,
      backgroundImageClass: this.getAttribute('dark-background-url')
        ? this.registerDarkBackgroundImageClass()
        : null,
      innerBackgroundClass: this.getAttribute('dark-inner-background-color')
        ? registerDarkModeRule(this.context && this.context.globalData, {
            cssProperty: 'background-color',
            cssValue: this.getAttribute('dark-inner-background-color'),
          })
        : null,
    }

    return this.darkClasses
  }

  getChildContext() {
    // Refactor -- removePaddingFor(width, ['padding', 'inner-padding'])
    const { containerWidth } = this.context
    const paddingSize =
      this.getShorthandAttrValue('padding', 'left') +
      this.getShorthandAttrValue('padding', 'right')

    let currentContainerWidth = `${parseFloat(containerWidth)}px`

    const { unit, parsedWidth } = widthParser(currentContainerWidth, {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      currentContainerWidth = `${
        (parseFloat(containerWidth) * parsedWidth) / 100 - paddingSize
      }px`
    } else {
      currentContainerWidth = `${parsedWidth - paddingSize}px`
    }

    return {
      ...this.context,
      containerWidth: currentContainerWidth,
    }
  }

  getStyles() {
    const { containerWidth } = this.context
    const { containerWidth: currentContainerWidth } = this.getChildContext()
    const backgroundRatio = Math.round(
      (parseInt(this.getAttribute('background-height'), 10) /
        parseInt(this.getAttribute('background-width'), 10)) *
        100,
    )

    const width = this.getAttribute('background-width') || containerWidth

    return {
      div: {
        margin: '0 auto',
        'max-width': containerWidth,
      },
      table: {
        width: '100%',
      },
      tr: {
      },
      'td-fluid': {
        width: `0.01%`,
        'padding-bottom': `${backgroundRatio}%`,
        'mso-padding-bottom-alt': '0',
      },
      'outlook-table': {
        width: containerWidth,
      },
      'outlook-td': {
        'line-height': 0,
        'font-size': 0,
        'mso-line-height-rule': 'exactly',
      },
      'outlook-inner-table': {
        width: currentContainerWidth,
      },
      'outlook-image': {
        border: '0',
        height: this.getAttribute('background-height'),
        'mso-position-horizontal': 'center',
        position: 'absolute',
        top: 0,
        width,
        'z-index': '-3',
      },
      'outlook-inner-td': {
        'background-color': this.getAttribute('inner-background-color'),
        padding: this.getAttribute('inner-padding'),
        'padding-top': this.getAttribute('inner-padding-top'),
        'padding-left': this.getAttribute('inner-padding-left'),
        'padding-right': this.getAttribute('inner-padding-right'),
        'padding-bottom': this.getAttribute('inner-padding-bottom'),
        ...(!!this.getAttribute('background-url') && { 'width': currentContainerWidth }),
      },
      'inner-div': {
        'background-color': this.getAttribute('inner-background-color'),
        float: this.getAttribute('align'),
        margin: '0px auto',
        width: this.getAttribute('width'),
        padding: this.getAttribute('inner-padding'),
        'padding-top': this.getAttribute('inner-padding-top'),
        'padding-left': this.getAttribute('inner-padding-left'),
        'padding-right': this.getAttribute('inner-padding-right'),
        'padding-bottom': this.getAttribute('inner-padding-bottom'),
      },
      'inner-table': {
        width: '100%',
        margin: '0px',
      },
    }
  }

  getBackground = () =>
    makeBackgroundString([
      this.getAttribute('background-color'),
      ...(this.getAttribute('background-url')
        ? [
            `url('${this.getAttribute('background-url')}')`,
            `${this.getAttribute('background-position')} / cover`,
          ]
        : []),
    ])

  renderContent() {
    const { containerWidth: currentContainerWidth } = this.getChildContext()
    const { children } = this.props
    const { innerBackgroundClass } = this.getDarkClasses()

    return `
      ${msoConditionalTag(`
        <table
          ${this.htmlAttributes({
            align: this.getAttribute('align'),
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            style: 'outlook-inner-table',
            width: parseInt(currentContainerWidth, 10),
          })}
        >
          <tr>
            <td ${this.htmlAttributes({ style: 'outlook-inner-td' })}>
      `)}
      <div
        ${this.htmlAttributes({
          align: this.getAttribute('align'),
          class: ['mj-hero-content', innerBackgroundClass].filter(Boolean).join(' '),
          style: 'inner-div',
        })}
      >
        <table
          ${this.htmlAttributes({
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'none',
            style: 'inner-table',
          })}
        >
          <tr>
            <td ${this.htmlAttributes({ style: 'inner-td' })} >
              <table
                ${this.htmlAttributes({
                  border: '0',
                  cellpadding: '0',
                  cellspacing: '0',
                  role: 'none',
                  style: 'inner-table',
                })}
              >
                ${this.renderChildren(children, {
                  renderer: (component) =>
                    component.constructor.isRawElement()
                      ? component.render()
                      : `
                    <tr>
                      <td
                        ${component.htmlAttributes({
                          align: component.getAttribute('align'),
                          background: component.getAttribute(
                            'container-background-color',
                          ),
                          class: component.getAttribute('css-class'),
                          style: {
                            background: component.getAttribute(
                              'container-background-color',
                            ),
                            'font-size': '0px',
                            padding: component.getAttribute('padding'),
                            'padding-top':
                              component.getAttribute('padding-top'),
                            'padding-right':
                              component.getAttribute('padding-right'),
                            'padding-bottom':
                              component.getAttribute('padding-bottom'),
                            'padding-left':
                              component.getAttribute('padding-left'),
                            'word-break': 'break-word',
                          },
                        })}
                      >
                        ${component.render()}
                      </td>
                    </tr>
                  `,
                })}
              </table>
            </td>
          </tr>
        </table>
      </div>
      ${msoConditionalTag(`
            </td>
          </tr>
        </table>
      `)}
    `
  }

  renderMode() {
    const { backgroundClass, backgroundImageClass } = this.getDarkClasses()

    const commonAttributes = {
      background: this.getAttribute('background-url'),
      class:
        [backgroundClass, backgroundImageClass].filter(Boolean).join(' ') ||
        undefined,
      style: {
        background: this.getBackground(),
        'background-position': this.getAttribute('background-position'),
        'background-repeat': 'no-repeat',
        'border-radius': this.getAttribute('border-radius'),
        padding: this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'vertical-align': this.getAttribute('vertical-align'),
      },
    }

    /* eslint-disable no-alert, no-case-declarations */
    switch (this.getAttribute('mode')) {
      case 'fluid-height':
        const magicTd = this.htmlAttributes({ style: `td-fluid` })

        return `
          <td ${magicTd}></td>
          <td ${this.htmlAttributes({ ...commonAttributes })}>
            ${this.renderContent()}
          </td>
          <td ${magicTd}></td>
        `
      case 'fixed-height':
      default:
        const height =
          parseInt(this.getAttribute('height'), 10) -
          this.getShorthandAttrValue('padding', 'top') -
          this.getShorthandAttrValue('padding', 'bottom')

        return `
          <td
            ${this.htmlAttributes({
              ...commonAttributes,
              height,
              style: {
                ...commonAttributes.style,
                height: `${height}px`,
              },
            })}
          >
            ${this.renderContent()}
          </td>
        `
    }
    /* eslint-enable no-alert, no-case-declarations */
  }

  render() {
    const { containerWidth } = this.context

    return `
      ${msoConditionalTag(`
        <table
          ${this.htmlAttributes({
            align: 'center',
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'none',
            style: 'outlook-table',
            width: parseInt(containerWidth, 10),
          })}
        >
          <tr>
            <td ${this.htmlAttributes({ style: 'outlook-td' })}>
              <v:image
                ${this.htmlAttributes({
                  style: 'outlook-image',
                  src: this.getAttribute('background-url'),
                  'xmlns:v': 'urn:schemas-microsoft-com:vml',
                })}
              />
      `)}
      <div
        ${this.htmlAttributes({
          align: this.getAttribute('align'),
          class: this.getAttribute('css-class'),
          style: 'div',
        })}
      >
        <table
          ${this.htmlAttributes({
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'none',
            style: 'table',
          })}
        >
          <tr
            ${this.htmlAttributes({
            })}
          >
            ${this.renderMode()}
          </tr>
      </table>
    </div>
    ${msoConditionalTag(`
          </td>
        </tr>
      </table>
    `)}
    `
  }
}
