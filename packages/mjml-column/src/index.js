import { BodyComponent } from 'mjml-core'

import widthParser from 'mjml-core/lib/helpers/widthParser'

export default class MjColumn extends BodyComponent {
  static componentName = 'mj-column'

  static allowedAttributes = {
    'background-color': 'color',
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-radius': 'string',
    'border-right': 'string',
    'border-top': 'string',
    direction: 'enum(ltr,rtl)',
    'inner-background-color': 'color',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'inner-border': 'string',
    'inner-border-bottom': 'string',
    'inner-border-left': 'string',
    'inner-border-radius': 'string',
    'inner-border-right': 'string',
    'inner-border-top': 'string',
    padding: 'unit(px,%){1,4}',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%)',
  }

  static defaultAttributes = {
    direction: 'ltr',
    'vertical-align': 'top',
  }

  getChildContext() {
    const { containerWidth: parentWidth } = this.context
    const { nonRawSiblings } = this.props
    const { borders, paddings } = this.getBoxWidths()
    const innerBorders =
      this.getShorthandBorderValue('left', 'inner-border') +
      this.getShorthandBorderValue('right', 'inner-border')

    const allPaddings = paddings + borders + innerBorders

    let containerWidth =
      this.getAttribute('width') ||
      `${parseFloat(parentWidth) / nonRawSiblings}px`

    const { unit, parsedWidth } = widthParser(containerWidth, {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      containerWidth = `${
        (parseFloat(parentWidth) * parsedWidth) / 100 - allPaddings
      }px`
    } else {
      containerWidth = `${parsedWidth - allPaddings}px`
    }

    return {
      ...this.context,
      containerWidth,
    }
  }

  getStyles() {
    const hasBorderRadius = this.hasBorderRadius()
    const hasInnerBorderRadius = this.hasInnerBorderRadius()

    const tableStyle = {
      'background-color': this.getAttribute('background-color'),
      border: this.getAttribute('border'),
      'border-bottom': this.getAttribute('border-bottom'),
      'border-left': this.getAttribute('border-left'),
      'border-radius': this.getAttribute('border-radius'),
      'border-right': this.getAttribute('border-right'),
      'border-top': this.getAttribute('border-top'),
      'vertical-align': this.getAttribute('vertical-align'),
      ...(hasBorderRadius && { 'border-collapse': 'separate' }),
    }

    const mobileGutterStyles = this.getMobileGutterStyles()
    const outlookGutterStyles = this.getOutlookGutterStyles()

    return {
      div: {
        'font-size': '0px',
        'text-align': 'left',
        direction: this.getAttribute('direction'),
        display: 'inline-block',
        'vertical-align': this.getAttribute('vertical-align'),
        width: this.getMobileWidth(),
        ...mobileGutterStyles,
      },
      table: {
        ...(this.hasGutter()
          ? {
              'background-color': this.getAttribute('inner-background-color'),
              border: this.getAttribute('inner-border'),
              'border-bottom': this.getAttribute('inner-border-bottom'),
              'border-left': this.getAttribute('inner-border-left'),
              'border-radius': this.getAttribute('inner-border-radius'),
              'border-right': this.getAttribute('inner-border-right'),
              'border-top': this.getAttribute('inner-border-top'),
            }
          : tableStyle),
        ...(hasInnerBorderRadius && { 'border-collapse': 'separate' }),
      },
      tdOutlook: {
        'vertical-align': this.getAttribute('vertical-align'),
        width: this.getWidthAsPixel(),
        ...outlookGutterStyles,
      },
      gutter: {
        ...tableStyle,
        padding: this.getAttribute('padding'),
        'padding-top': this.getAttribute('padding-top'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
      },
    }
  }

  getMobileWidth() {
    const { containerWidth, isInGroup } = this.context
    const { nonRawSiblings } = this.props
    const width = this.getAttribute('width')
    const mobileWidth = this.getAttribute('mobileWidth')

    if (mobileWidth !== 'mobileWidth') {
      return '100%'
    }

    // Group columns don't stack on mobile, so use gutter-reduced desktop width
    if (isInGroup && this.hasColumnGutter()) {
      const { parsedWidth, unit } = this.getDesktopWidth()
      if (unit === '%') {
        return `${parsedWidth}%`
      }
      return `${MjColumn.normalizeUnitValue((parsedWidth / parseInt(containerWidth, 10)) * 100)}%`
    }

    if (width === undefined) {
      return `${parseInt(100 / nonRawSiblings, 10)}%`
    }

    const { unit, parsedWidth } = widthParser(width, {
      parseFloatToInt: false,
    })

    switch (unit) {
      case '%':
        return width
      case 'px':
      default:
        return `${
          MjColumn.normalizeUnitValue(
            (parsedWidth / parseInt(containerWidth, 10)) * 100,
          )
        }%`
    }
  }

  getWidthAsPixel() {
    const { containerWidth } = this.context

    const { unit, parsedWidth } = widthParser(this.getParsedWidth(true), {
      parseFloatToInt: false,
    })

    if (unit === '%') {
      return `${MjColumn.normalizePxValue((parseFloat(containerWidth) * parsedWidth) / 100)}px`
    }
    return `${MjColumn.normalizePxValue(parsedWidth)}px`
  }

  getParsedWidth(toString) {
    const { nonRawSiblings } = this.props

    const width = this.getAttribute('width') || `${100 / nonRawSiblings}%`

    const { unit, parsedWidth } = widthParser(width, {
      parseFloatToInt: false,
    })

    if (toString) {
      return `${parsedWidth}${unit}`
    }

    return {
      unit,
      parsedWidth,
    }
  }

  getColumnClass() {
    const { addMediaQuery } = this.context
    const { isInGroup } = this.context

    let className = ''

    const { parsedWidth, unit } = this.hasColumnGutter()
      ? this.getDesktopWidth()
      : this.getParsedWidth()
    const normalizedParsedWidth =
      unit === 'px' ? MjColumn.normalizePxValue(parsedWidth) : parsedWidth
    const formattedClassNb = normalizedParsedWidth.toString().replace('.', '-')

    switch (unit) {
      case '%':
        className = `mj-column-per-${formattedClassNb}`
        break

      case 'px':
      default:
        className = `mj-column-px-${formattedClassNb}`
        break
    }

    // Add className to media queries
    if (this.hasColumnGutter()) {
      addMediaQuery(className, {
        parsedWidth: normalizedParsedWidth,
        unit,
      })

      // Group columns already carry gutter padding inline; avoid duplicate media-query rules
      if (!isInGroup) {
        addMediaQuery(this.getDesktopGutterClassName(), {
          padding: this.getDesktopPadding(),
        })
      }
    } else {
      addMediaQuery(className, {
        parsedWidth: normalizedParsedWidth,
        unit,
      })
    }

    return className
  }

  getDesktopGutterClassName() {
    const gutterUnit = this.getDesktopUnit()
    const gutter = this.getNormalizedGutterValue(gutterUnit)
    const gutterUnitToken = gutterUnit === '%' ? 'per' : gutterUnit
    const directionToken = this.context.direction === 'rtl' ? '-rtl' : ''
    const normalizedGutter =
      gutterUnit === 'px' ? MjColumn.normalizePxValue(gutter) : gutter

    const gutterToken = MjColumn.normalizeUnitValue(normalizedGutter)
      .toString()
      .replace('.', '-')

    return `mj-column-gutter-${this.props.sibling}-${this.props.index + 1}-${gutterUnitToken}-${gutterToken}${directionToken}`
  }

  getDesktopUnit() {
    return this.getParsedWidth().unit
  }

  getDesktopWidth() {
    const { sibling, index } = this.props
    const { parsedWidth, unit } = this.getParsedWidth()

    if (!this.hasColumnGutter()) {
      return {
        parsedWidth: unit === 'px' ? MjColumn.normalizePxValue(parsedWidth) : parsedWidth,
        unit,
      }
    }

    const gutter = this.getNormalizedGutterValue(unit)
    const reduction = (gutter * (sibling - 1)) / sibling

    const reducedWidth = Math.max(0, MjColumn.normalizeUnitValue(parsedWidth - reduction))

    if (unit === 'px') {
      const floorWidth = Math.floor(reducedWidth)
      const fractional = reducedWidth - floorWidth
      const extraPixels = Math.max(0, Math.min(sibling, Math.round(sibling * fractional)))

      return {
        parsedWidth: floorWidth + (index < extraPixels ? 1 : 0),
        unit,
      }
    }

    return {
      parsedWidth: reducedWidth,
      unit,
    }
  }

  static normalizeUnitValue(value) {
    return Number(parseFloat(value).toFixed(6))
  }

  static normalizePxValue(value) {
    return Math.round(parseFloat(value))
  }

  getNormalizedGutterValue(targetUnit) {
    const { gutter } = this.context

    if (!gutter) {
      return 0
    }

    const { containerWidth } = this.context
    const { unit, parsedWidth } = widthParser(gutter, {
      parseFloatToInt: false,
    })

    if (unit === targetUnit) {
      return parsedWidth
    }

    if (targetUnit === '%' && unit === 'px') {
      return (parsedWidth / parseFloat(containerWidth)) * 100
    }

    if (targetUnit === 'px' && unit === '%') {
      return (parseFloat(containerWidth) * parsedWidth) / 100
    }

    return parsedWidth
  }

  hasColumnGutter() {
    const { gutter } = this.context

    return gutter != null && gutter !== ''
  }

  getDesktopPaddingValues(unit) {
    const { first, last, sibling } = this.props
    const { direction } = this.context
    const gutter = this.getNormalizedGutterValue(unit)
    const normalizedGutter =
      unit === 'px' ? MjColumn.normalizePxValue(gutter) : gutter
    const isPx = unit === 'px'
    const halfLeading = isPx ? Math.ceil(normalizedGutter / 2) : normalizedGutter / 2
    const halfTrailing = isPx
      ? Math.floor(normalizedGutter / 2)
      : normalizedGutter / 2
    const isRTL = direction === 'rtl'

    if (sibling === 1) {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }
    }

    // When RTL, first/last visual positions are reversed
    if (isRTL) {
      return {
        top: 0,
        right: first ? 0 : halfTrailing,
        bottom: 0,
        left: last ? 0 : halfLeading,
      }
    }

    return {
      top: 0,
      right: last ? 0 : halfLeading,
      bottom: 0,
      left: first ? 0 : halfTrailing,
    }
  }

  getMobilePaddingValues() {
    const { first, last } = this.props
    const gutter = this.getNormalizedGutterValue('%')
    const half = gutter / 2

    // On mobile: gutter appears as vertical spacing between stacked columns,
    // but not on outer left/right edges
    return {
      top: first ? 0 : half,
      right: 0,
      bottom: last ? 0 : half,
      left: 0,
    }
  }

  static formatPadding(top, right, bottom, left, unit) {
    if (unit === 'px') {
      return `${MjColumn.normalizePxValue(top)}px ${MjColumn.normalizePxValue(
        right,
      )}px ${MjColumn.normalizePxValue(bottom)}px ${MjColumn.normalizePxValue(
        left,
      )}px`
    }

    return `${MjColumn.normalizeUnitValue(top)}${unit} ${MjColumn.normalizeUnitValue(
      right,
    )}${unit} ${MjColumn.normalizeUnitValue(bottom)}${unit} ${
      MjColumn.normalizeUnitValue(left)
    }${unit}`
  }

  getDesktopPadding() {
    const unit = this.getDesktopUnit()
    const { top, right, bottom, left } = this.getDesktopPaddingValues(unit)

    return MjColumn.formatPadding(top, right, bottom, left, unit)
  }

  getMobilePadding() {
    const { top, right, bottom, left } = this.getMobilePaddingValues()

    return MjColumn.formatPadding(top, right, bottom, left, '%')
  }

  getMobileGutterStyles() {
    if (!this.hasColumnGutter()) {
      return {}
    }

    const { isInGroup } = this.context

    // Group columns don't stack on mobile, so maintain desktop horizontal padding
    if (isInGroup) {
      return {
        padding: this.getDesktopPadding(),
      }
    }

    // Regular columns: vertical spacing between stacked columns
    return {
      padding: this.getMobilePadding(),
    }
  }

  getOutlookGutterStyles() {
    if (!this.hasColumnGutter()) {
      return {}
    }

    const { top, right, bottom, left } = this.getDesktopPaddingValues('px')

    return {
      padding: MjColumn.formatPadding(top, right, bottom, left, 'px'),
    }
  }



  hasBorderRadius() {
    const borderRadius = this.getAttribute('border-radius')
    return borderRadius !== '' && typeof borderRadius !== 'undefined'
  }

  hasInnerBorderRadius() {
    const innerBorderRadius = this.getAttribute('inner-border-radius')
    return innerBorderRadius !== '' && typeof innerBorderRadius !== 'undefined'
  }

  hasGutter() {
    return [
      'padding',
      'padding-bottom',
      'padding-left',
      'padding-right',
      'padding-top',
    ].some((attr) => this.getAttribute(attr) != null)
  }

  renderGutter() {
    const hasBorderRadius = this.hasBorderRadius()

    return `
      <table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          width: '100%',
          ...(hasBorderRadius && {
            style: { 'border-collapse': 'separate' },
          }),
        })}
      >
        <tbody>
          <tr>
            <td ${this.htmlAttributes({ style: 'gutter' })}>
              ${this.renderColumn()}
            </td>
          </tr>
        </tbody>
      </table>
    `
  }

  renderColumn() {
    const { children } = this.props

    return `
      <table
        ${this.htmlAttributes({
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: 'table',
          width: '100%',
        })}
      >
        <tbody>
          ${this.renderChildren(children, {
            renderer: (component) =>
              component.constructor.isRawElement()
                ? component.render()
                : `
              <tr>
                <td
                  ${component.htmlAttributes({
                    align: component.getAttribute('align'),
                    class: component.getAttribute('css-class'),
                    style: {
                      background: component.getAttribute(
                        'container-background-color',
                      ),
                      'font-size': '0px',
                      padding: component.getAttribute('padding'),
                      'padding-top': component.getAttribute('padding-top'),
                      'padding-right': component.getAttribute('padding-right'),
                      'padding-bottom':
                        component.getAttribute('padding-bottom'),
                      'padding-left': component.getAttribute('padding-left'),
                      'word-break': 'break-word',
                    },
                  })}
                >
                  ${component.render()}
                </td>
              </tr>
            `,
          })}
        </tbody>
      </table>
    `
  }

  render() {
    const defaultClass = this.getColumnClass()

    let classesName = defaultClass

    if (this.hasColumnGutter()) {
      classesName += ` ${this.getDesktopGutterClassName()}`
    }

    classesName += ' mj-outlook-group-fix'

    if (this.getAttribute('css-class')) {
      classesName += ` ${this.getAttribute('css-class')}`
    }

    return `
      <div
        ${this.htmlAttributes({
          class: classesName,
          style: 'div',
        })}
      >
        ${this.hasGutter() ? this.renderGutter() : this.renderColumn()}
      </div>
    `
  }
}
