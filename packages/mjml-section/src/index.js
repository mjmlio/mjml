import { BodyComponent, suffixCssClasses } from 'mjml-core'
import { flow, identity, join, filter } from 'lodash/fp'
import { msoConditionalTag } from 'mjml-core/lib/helpers/conditionalTag'

const makeBackgroundString = flow(filter(identity), join(' '))

export default class MjSection extends BodyComponent {
  static componentName = 'mj-section'

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
    'full-width': 'enum(full-width,false,)',
    padding: 'unit(px,%){1,4}',
    'padding-top': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'column-align': 'enum(left,center,right)',
    'text-align': 'enum(left,center,right)',
    'text-padding': 'unit(px,%){1,4}',
  }

  static defaultAttributes = {
    'background-position': 'top center',
    'column-align': 'center',
    padding: '20px 0',
    'text-align': 'center',
    'text-padding': '4px 4px 4px 0',
  }

  getColumnAlign() {
    return this.getAttribute('column-align') || this.getAttribute('text-align')
  }

  getChildContext() {
    const { box } = this.getBoxWidths()

    return {
      ...this.context,
      containerWidth: `${box}px`,
      gap: this.getAttribute('gap'),
    }
  }

  getStyles() {
    const { containerWidth } = this.context

    const fullWidth = this.isFullWidth()

    const hasBorderRadius = this.hasBorderRadius()

    const isFirstSection = this.props.index === 0

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
      },
      table: {
        ...(fullWidth ? {} : background),
        width: '100%',
        ...(hasBorderRadius && { 'border-collapse': 'separate' }),
      },
      td: {
        border: this.getAttribute('border'),
        'border-bottom': this.getAttribute('border-bottom'),
        'border-left': this.getAttribute('border-left'),
        'border-right': this.getAttribute('border-right'),
        'border-top': this.getAttribute('border-top'),
        'border-radius': this.getAttribute('border-radius'),
        direction: this.getAttribute('direction'),
        'font-size': '0px',
        padding: this.getAttribute('padding'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-top': this.getAttribute('padding-top'),
        'text-align': this.getColumnAlign(),
      },
      div: {
        ...(fullWidth ? {} : background),
        margin: '0px auto',
        'max-width': containerWidth,
        'border-radius': this.getAttribute('border-radius'),
        ...(hasBorderRadius && { overflow: 'hidden' }),
        'margin-top': !isFirstSection ? this.context.gap : undefined,
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
            `url('${this.getAttribute('background-url')}')`,
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

  hasBorderRadius() {
    const borderRadius = this.getAttribute('border-radius')
    return borderRadius !== '' && typeof borderRadius !== 'undefined'
  }

  hasGap() {
    const { gap } = this.context
    return gap != null && gap !== ''
  }

  renderBefore() {
    const { containerWidth } = this.context
    const bgcolorAttr = this.getAttribute('background-color')
      ? { bgcolor: this.getAttribute('background-color') }
      : {}

    const isFirstSection = this.props.index === 0

    const hasGap = this.hasGap()

    return `
      ${msoConditionalTag(`
      <table
        ${this.htmlAttributes({
          align: 'center',
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          class: suffixCssClasses(this.getAttribute('css-class'), 'outlook'),
          role: 'none',
          style: {
            width: `${containerWidth}`,
            'padding-top': !isFirstSection ? this.context.gap : undefined,
          },
          width: parseInt(containerWidth, 10),
          ...(!hasGap && { ...bgcolorAttr }),
        })}
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      `)}
    `
  }

  // eslint-disable-next-line class-methods-use-this
  renderAfter() {
    return `
      ${msoConditionalTag(`
          </td>
        </tr>
      </table>
      `)}
    `
  }

  renderWrappedChildren() {
    const { children } = this.props

    return `
      ${msoConditionalTag(`
        <tr>
      `)}
      ${this.renderChildren(children, {
        renderer: (component) =>
          component.constructor.isRawElement()
            ? component.render()
            : `
          ${msoConditionalTag(`
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
          `)}
            ${component.render()}
          ${msoConditionalTag(`
            </td>
          `)}
    `,
      })}

      ${msoConditionalTag(`
        </tr>
      `)}
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
      ${msoConditionalTag(`
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
      `)}
          ${content}
      ${msoConditionalTag(`
        </v:textbox>
      </v:rect>
      `)}
    `
  }

  renderSection() {
    const hasBackground = this.hasBackground()

    const paddingLeft = this.getShorthandAttrValue('padding', 'left')
    const spacerTd = hasBackground
      ? `${msoConditionalTag(`<td style="padding-left:${paddingLeft}px;"></td>`)}`
      : ''

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
            role: 'none',
            style: 'table',
          })}
        >
          <tr>
            ${spacerTd}
            <td
              ${this.htmlAttributes({
                style: 'td',
              })}
            >
              ${msoConditionalTag(`
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              `)}
                ${this.renderWrappedChildren()}
              ${msoConditionalTag(`
                </table>
              `)}
            </td>
          </tr>
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
          role: 'none',
          style: 'tableFullwidth',
        })}
      >
        <tr>
          <td>
            ${content}
          </td>
        </tr>
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
