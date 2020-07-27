import { BodyComponent } from 'mjml-core'
import { flow, identity, join, filter } from 'lodash/fp'

import widthParser from 'mjml-core/lib/helpers/widthParser'

const makeBackgroundString = flow(filter(identity), join(' '))

export default class MjHero extends BodyComponent {
  static allowedAttributes = {
    mode: 'string',
    height: 'unit(px,%)',
    'background-url': 'string',
    'background-width': 'unit(px,%)',
    'background-height': 'unit(px,%)',
    'background-position': 'string',
    'container-background-color': 'color',
    'inner-background-color': 'color',
    'inner-padding': 'unit(px,%){1,4}',
    'inner-padding-top': 'unit(px,%)',
    'inner-padding-left': 'unit(px,%)',
    'inner-padding-right': 'unit(px,%)',
    'inner-padding-bottom': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'background-color': 'color',
    'vertical-align': 'enum(top,bottom,middle)',
  }

  static defaultAttributes = {
    mode: 'fixed-height',
    height: '0px',
    'background-url': null,
    'background-position': 'center center',
    padding: '0px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'background-color': '#ffffff',
    'vertical-align': 'top',
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
        'vertical-align': 'top',
      },
      'td-fluid': {
        width: `0.01%`,
        'padding-bottom': `${backgroundRatio}%`,
        'mso-padding-bottom-alt': '0',
      },
      hero: {
        background: this.getBackground(),
        'background-position': this.getAttribute('background-position'),
        'background-repeat': 'no-repeat',
        padding: this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'vertical-align': this.getAttribute('vertical-align'),
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
        width: containerWidth,
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
      },
      'inner-table': {
        width: '100%',
        margin: '0px',
      },
      'inner-div': {
        'background-color': this.getAttribute('inner-background-color'),
        float: this.getAttribute('align'),
        margin: '0px auto',
        width: this.getAttribute('width'),
      },
    }
  }

  getBackground = () =>
    makeBackgroundString([
      this.getAttribute('background-color'),
      ...(this.getAttribute('background-url')
        ? [
            `url(${this.getAttribute('background-url')})`,
            'no-repeat',
            `${this.getAttribute('background-position')} / cover`,
          ]
        : []),
    ])

  renderContent() {
    const { containerWidth } = this.context
    const { children } = this.props

    return `
      <!--[if mso | IE]>
        <table
          ${this.htmlAttributes({
            align: this.getAttribute('align'),
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            style: 'outlook-inner-table',
            width: containerWidth.replace('px', ''),
          })}
        >
          <tr>
            <td ${this.htmlAttributes({ style: 'outlook-inner-td' })}>
      <![endif]-->
      <div
        ${this.htmlAttributes({
          align: this.getAttribute('align'),
          class: 'mj-hero-content',
          style: 'inner-div',
        })}
      >
        <table
          ${this.htmlAttributes({
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
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
                  role: 'presentation',
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
                            'padding-top': component.getAttribute(
                              'padding-top',
                            ),
                            'padding-right': component.getAttribute(
                              'padding-right',
                            ),
                            'padding-bottom': component.getAttribute(
                              'padding-bottom',
                            ),
                            'padding-left': component.getAttribute(
                              'padding-left',
                            ),
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
      <!--[if mso | IE]>
            </td>
          </tr>
        </table>
      <![endif]-->
    `
  }

  renderMode() {
    const commonAttributes = {
      background: this.getAttribute('background-url'),
      style: 'hero',
    }

    /* eslint-disable no-alert, no-case-declarations */
    switch (this.getAttribute('mode')) {
      case 'fluid-height':
        const magicTd = this.htmlAttributes({ style: `td-fluid` })

        return `
          <td ${magicTd} />
          <td ${this.htmlAttributes({ ...commonAttributes })}>
            ${this.renderContent()}
          </td>
          <td ${magicTd} />
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
      <!--[if mso | IE]>
        <table
          ${this.htmlAttributes({
            align: 'center',
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
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
      <![endif]-->
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
            role: 'presentation',
            style: 'table',
          })}
        >
          <tr
            ${this.htmlAttributes({
              style: 'tr',
            })}
          >
            ${this.renderMode()}
          </tr>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
    <![endif]-->
    `
  }
}
