import { BodyComponent, suffixCssClasses } from 'mjml-core'
import { flow, identity, join, filter } from 'lodash/fp'

const makeBackgroundString = flow(filter(identity), join(' '))

export default class MjSection extends BodyComponent {
  static allowedAttributes = {
    'background-color': 'color',
    'background-url': 'string',
    'background-repeat': 'enum(repeat,no-repeat)',
    'background-size': 'string',
    'background-position': 'string',
    'background-position-x': 'string',
    'background-position-y': 'string',
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-radius': 'string',
    'border-right': 'string',
    'border-top': 'string',
    direction: 'enum(ltr,rtl)',
    'full-width': 'enum(full-width)',
    padding: 'unit(px,%){1,4}',
    'padding-top': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'text-align': 'enum(left,center,right)',
    'text-padding': 'unit(px,%){1,4}',
  }

  static defaultAttributes = {
    'background-repeat': 'repeat',
    'background-size': 'auto',
    'background-position': 'top center',
    direction: 'ltr',
    padding: '20px 0',
    'text-align': 'center',
    'text-padding': '4px 4px 4px 0',
  }

  getChildContext() {
    const { box } = this.getBoxWidths()

    return {
      ...this.context,
      containerWidth: `${box}px`,
    }
  }

  getStyles() {
    const { containerWidth } = this.context

    const fullWidth = this.isFullWidth()

    const background = this.getAttribute('background-url')
      ? {
          background: this.getBackground(),
          // background size, repeat and position has to be seperate since yahoo does not support shorthand background css property
          'background-position': this.getBackgroundString(),
          'background-repeat': this.getAttribute('background-repeat'),
          'background-size': this.getAttribute('background-size'),
        }
      : {
          background: this.getAttribute('background-color'),
          'background-color': this.getAttribute('background-color'),
        }

    return {
      tableFullwidth: {
        ...(fullWidth ? background : {}),
        width: '100%',
        'border-radius': this.getAttribute('border-radius'),
      },
      table: {
        ...(fullWidth ? {} : background),
        width: '100%',
        'border-radius': this.getAttribute('border-radius'),
      },
      td: {
        border: this.getAttribute('border'),
        'border-bottom': this.getAttribute('border-bottom'),
        'border-left': this.getAttribute('border-left'),
        'border-right': this.getAttribute('border-right'),
        'border-top': this.getAttribute('border-top'),
        direction: this.getAttribute('direction'),
        'font-size': '0px',
        padding: this.getAttribute('padding'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-top': this.getAttribute('padding-top'),
        'text-align': this.getAttribute('text-align'),
      },
      div: {
        ...(fullWidth ? {} : background),
        margin: '0px auto',
        'border-radius': this.getAttribute('border-radius'),
        'max-width': containerWidth,
      },
      innerDiv: {
        'line-height': '0',
        'font-size': '0',
      },
    }
  }

  getBackground() {
    return makeBackgroundString([
      this.getAttribute('background-color'),
      ...(this.hasBackground()
        ? [
            `url(${this.getAttribute('background-url')})`,
            this.getBackgroundString(),
            `/ ${this.getAttribute('background-size')}`,
            this.getAttribute('background-repeat'),
          ]
        : []),
    ])
  }

  getBackgroundString() {
    const { posX, posY } = this.getBackgroundPosition()
    return `${posX} ${posY}`
  }

  getBackgroundPosition() {
    const { x, y } = this.parseBackgroundPosition()

    return {
      posX: this.getAttribute('background-position-x') || x,
      posY: this.getAttribute('background-position-y') || y,
    }
  }

  parseBackgroundPosition() {
    const posSplit = this.getAttribute('background-position').split(' ')

    if (posSplit.length === 1) {
      const val = posSplit[0]
      // here we must determine if x or y was provided ; other will be center
      if (['top', 'bottom'].includes(val)) {
        return {
          x: 'center',
          y: val,
        }
      }

      return {
        x: val,
        y: 'center',
      }
    }

    if (posSplit.length === 2) {
      // x and y can be put in any order in background-position so we need to determine that based on values
      const val1 = posSplit[0]
      const val2 = posSplit[1]

      if (
        ['top', 'bottom'].includes(val1) ||
        (val1 === 'center' && ['left', 'right'].includes(val2))
      ) {
        return {
          x: val2,
          y: val1,
        }
      }

      return {
        x: val1,
        y: val2,
      }
    }

    // more than 2 values is not supported, let's treat as default value
    return { x: 'center', y: 'top' }
  }

  hasBackground() {
    return this.getAttribute('background-url') != null
  }

  isFullWidth() {
    return this.getAttribute('full-width') === 'full-width'
  }

  renderBefore() {
    const { containerWidth } = this.context

    return `
      <!--[if mso | IE]>
      <table
        ${this.htmlAttributes({
          align: 'center',
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          class: suffixCssClasses(this.getAttribute('css-class'), 'outlook'),
          style: { width: `${containerWidth}` },
          width: parseInt(containerWidth, 10),
        })}
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    `
  }

  // eslint-disable-next-line class-methods-use-this
  renderAfter() {
    return `
      <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
    `
  }

  renderWrappedChildren() {
    const { children } = this.props

    return `
      <!--[if mso | IE]>
        <tr>
      <![endif]-->
      ${this.renderChildren(children, {
        renderer: (component) =>
          component.constructor.isRawElement()
            ? component.render()
            : `
          <!--[if mso | IE]>
            <td
              ${component.htmlAttributes({
                align: component.getAttribute('align'),
                class: suffixCssClasses(
                  component.getAttribute('css-class'),
                  'outlook',
                ),
                style: 'tdOutlook',
              })}
            >
          <![endif]-->
            ${component.render()}
          <!--[if mso | IE]>
            </td>
          <![endif]-->
    `,
      })}

      <!--[if mso | IE]>
        </tr>
      <![endif]-->
    `
  }

  renderWithBackground(content) {
    const fullWidth = this.isFullWidth()

    const { containerWidth } = this.context

    const isPercentage = (str) => /^\d+(\.\d+)?%$/.test(str)

    let vSizeAttributes = {}
    let { posX: bgPosX, posY: bgPosY } = this.getBackgroundPosition()

    switch (bgPosX) {
      case 'left':
        bgPosX = '0%'
        break
      case 'center':
        bgPosX = '50%'
        break
      case 'right':
        bgPosX = '100%'
        break
      default:
        if (!isPercentage(bgPosX)) {
          bgPosX = '50%'
        }
        break
    }
    switch (bgPosY) {
      case 'top':
        bgPosY = '0%'
        break
      case 'center':
        bgPosY = '50%'
        break
      case 'bottom':
        bgPosY = '100%'
        break
      default:
        if (!isPercentage(bgPosY)) {
          bgPosY = '0%'
        }
        break
    }

    // this logic is different when using repeat or no-repeat
    let [[vOriginX, vPosX], [vOriginY, vPosY]] = ['x', 'y'].map(
      (coordinate) => {
        const isX = coordinate === 'x'
        const bgRepeat = this.getAttribute('background-repeat') === 'repeat'
        let pos = isX ? bgPosX : bgPosY
        let origin = isX ? bgPosX : bgPosY

        if (isPercentage(pos)) {
          // Should be percentage at this point
          const percentageValue = pos.match(/^(\d+(\.\d+)?)%$/)[1]
          const decimal = parseInt(percentageValue, 10) / 100

          if (bgRepeat) {
            pos = decimal
            origin = decimal
          } else {
            pos = (-50 + decimal * 100) / 100
            origin = (-50 + decimal * 100) / 100
          }
        } else if (bgRepeat) {
          // top (y) or center (x)
          origin = isX ? '0.5' : '0'
          pos = isX ? '0.5' : '0'
        } else {
          origin = isX ? '0' : '-0.5'
          pos = isX ? '0' : '-0.5'
        }

        return [origin, pos]
      },
      this,
    )

    // If background size is either cover or contain, we tell VML to keep the aspect
    // and fill the entire element.
    if (
      this.getAttribute('background-size') === 'cover' ||
      this.getAttribute('background-size') === 'contain'
    ) {
      vSizeAttributes = {
        size: '1,1',
        aspect:
          this.getAttribute('background-size') === 'cover'
            ? 'atleast'
            : 'atmost',
      }
    } else if (this.getAttribute('background-size') !== 'auto') {
      const bgSplit = this.getAttribute('background-size').split(' ')

      if (bgSplit.length === 1) {
        vSizeAttributes = {
          size: this.getAttribute('background-size'),
          aspect: 'atmost', // reproduces height auto
        }
      } else {
        vSizeAttributes = {
          size: bgSplit.join(','),
        }
      }
    }

    let vmlType =
      this.getAttribute('background-repeat') === 'no-repeat' ? 'frame' : 'tile'

    if (this.getAttribute('background-size') === 'auto') {
      vmlType = 'tile' // if no size provided, keep old behavior because outlook can't use original image size with "frame"
      ;[[vOriginX, vPosX], [vOriginY, vPosY]] = [
        [0.5, 0.5],
        [0, 0],
      ] // also ensure that images are still cropped the same way
    }

    return `
      <!--[if mso | IE]>
        <v:rect ${this.htmlAttributes({
          style: fullWidth
            ? { 'mso-width-percent': '1000' }
            : { width: containerWidth },
          'xmlns:v': 'urn:schemas-microsoft-com:vml',
          fill: 'true',
          stroke: 'false',
        })}>
        <v:fill ${this.htmlAttributes({
          origin: `${vOriginX}, ${vOriginY}`,
          position: `${vPosX}, ${vPosY}`,
          src: this.getAttribute('background-url'),
          color: this.getAttribute('background-color'),
          type: vmlType,
          ...vSizeAttributes,
        })} />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
          ${content}
        <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
    <![endif]-->
    `
  }

  renderSection() {
    const hasBackground = this.hasBackground()

    return `
      <div ${this.htmlAttributes({
        class: this.isFullWidth() ? null : this.getAttribute('css-class'),
        style: 'div',
      })}>
        ${
          hasBackground
            ? `<div ${this.htmlAttributes({ style: 'innerDiv' })}>`
            : ''
        }
        <table
          ${this.htmlAttributes({
            align: 'center',
            background: this.isFullWidth()
              ? null
              : this.getAttribute('background-url'),
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
            style: 'table',
          })}
        >
          <tbody>
            <tr>
              <td
                ${this.htmlAttributes({
                  style: 'td',
                })}
              >
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <![endif]-->
                  ${this.renderWrappedChildren()}
                <!--[if mso | IE]>
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        ${hasBackground ? '</div>' : ''}
      </div>
    `
  }

  renderFullWidth() {
    const content = this.hasBackground()
      ? this.renderWithBackground(`
        ${this.renderBefore()}
        ${this.renderSection()}
        ${this.renderAfter()}
      `)
      : `
        ${this.renderBefore()}
        ${this.renderSection()}
        ${this.renderAfter()}
      `

    return `
      <table
        ${this.htmlAttributes({
          align: 'center',
          class: this.getAttribute('css-class'),
          background: this.getAttribute('background-url'),
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: 'tableFullwidth',
        })}
      >
        <tbody>
          <tr>
            <td>
              ${content}
            </td>
          </tr>
        </tbody>
      </table>
    `
  }

  renderSimple() {
    const section = this.renderSection()

    return `
      ${this.renderBefore()}
      ${this.hasBackground() ? this.renderWithBackground(section) : section}
      ${this.renderAfter()}
    `
  }

  render() {
    return this.isFullWidth() ? this.renderFullWidth() : this.renderSimple()
  }
}
