import { MJMLElement, helpers } from 'mjml-core'
import cx from 'cx'
import React, { Component } from 'react'

const tagName = 'mj-hero'
const parentTag = ['mj-container', 'mj-wrapper']
const defaultMJMLDefinition = {
  attributes: {
    'mode': 'fixed-height',
    'height': '0px',
    'background-url': null,
    'background-width': '0px',
    'background-height': '0px',
    'background-position': 'center center',
    'padding': '0px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'background-color': '#ffffff',
    'vertical-align': 'top'
  }
}

const endingTag = false
const baseStyles = {
  div: {
    margin: '0 auto'
  },
  table: {
    width: '100%'
  },
  tr: {
    verticalAlign: 'top'
  },
  edge: {
    paddingBottom: '0%',
    width: '0.01%',
    msoPaddingBottomAlt: 0
  },
  hero: {
    backgroundRepeat: 'no-repeat',
    verticalAlign: 'top',
    backgroundSize: 'cover'
  }
}

const postRender = $ => {
  let backgroundCropTop = 0
  let backgroundCropBottom = 0
  let dataCrop = ''
  let $element
  let backgroundWidth = 0
  let backgroundHeight = 0
  let backgroundUrl = ''

  $('.mj-hero-outlook').each(function () {
    backgroundUrl = $(this).data('background-url')
    backgroundWidth = $(this).data('background-width')
    backgroundHeight = $(this).data('background-height')
    backgroundCropTop = 0
    backgroundCropBottom = 0
    dataCrop = ''

    $element = $(this).find('.mj-hero-fixed-height').first()

    if ($element.length) {
      dataCrop = $element.data('crop')
      backgroundHeight = $element.data('background-height')

      backgroundCropTop = dataCrop.split(', ')[0].split(':')[1]
      backgroundCropBottom = dataCrop.split(', ')[1].split(':')[1]

      $element
        .removeAttr('class')
        .removeAttr('data-background-height')
        .removeAttr('data-crop')
    }

    backgroundWidth = parseInt(backgroundWidth.replace('px', '')) * 0.75
    backgroundHeight = parseInt(backgroundHeight.replace('px', '')) * 0.75

    $(this)
      .before(`${helpers.startConditionalTag}
          <v:image
            xmlns:v="urn:schemas-microsoft-com:vml"
            croptop="${backgroundCropTop}"
            cropbottom="${backgroundCropBottom}"
            style="width:${backgroundWidth}pt;height:${backgroundHeight}pt;position:absolute;top:0;mso-position-horizontal:center;border:0;z-index:-3;"
            src="${backgroundUrl}" />
        ${helpers.endConditionalTag}`)
      .removeAttr('class')
      .removeAttr('data-background-width')
      .removeAttr('data-background-height')
      .removeAttr('data-background-url')
  })

  return $
}

@MJMLElement
class Hero extends Component {

  styles = this.getStyles()

  getFixedHeight () {
    const { mjAttribute, getPadding } = this.props
    let height = 0
    let paddingTop = 0
    let paddingBottom = 0

    height = parseInt(mjAttribute('height').replace('px', ''))
    paddingTop = Math.abs(
      getPadding('top')
    )
    paddingBottom = Math.abs(
      getPadding('bottom')
    )

    return height - paddingTop - paddingBottom
  }

  getBackgroundCrop () {
    const { mjAttribute } = this.props
    const height = parseInt(mjAttribute('height').replace('px', ''))
    const backgroundHeight = parseInt(mjAttribute('background-height').replace('px', ''))
    const backgroundPositionTop = mjAttribute('background-position').trim().split(' ')[0] || 'center'
    let cropTop = 0
    let cropBottom = 0

    if (height < backgroundHeight) {
      switch (backgroundPositionTop) {
        case 'top':
          cropBottom = Math.round((backgroundHeight - height) / backgroundHeight * 100) / 100
          break;
        case 'center':
          cropTop = Math.round((backgroundHeight - height) / 2 / backgroundHeight * 100) / 100
          cropBottom = cropTop
          break
        case 'bottom':
          cropTop = Math.round((backgroundHeight - height) / backgroundHeight * 100) / 100
          break;
      }
    }

    return `croptop:${cropTop}, cropbottom:${cropBottom}`
  }

  getBackgroundRatio () {
    const { mjAttribute } = this.props
    const backgroundWidth = parseInt(mjAttribute('background-width').replace('px', ''))
    const backgroundHeight = parseInt(mjAttribute('background-height').replace('px', ''))

    return Math.round((backgroundHeight / backgroundWidth * 100) * 10000) / 10000
  }

  getBackgroundStyle () {
    const { mjAttribute } = this.props
    let background = ''

    background += `${mjAttribute('background-color') || ''} `
    background += mjAttribute('background-url') ? `url(${mjAttribute('background-url')}) ` : ''
    background += 'no-repeat '
    background += `${mjAttribute('background-position')} `
    background +=  '/ cover'

    return background
  }

  getStyles () {
    const { mjAttribute, getPadding, defaultUnit, parentWidth } = this.props
    const backgroundRatio = this.getBackgroundRatio()
    const backgroundStyle = this.getBackgroundStyle()
    let width = parentWidth

    if (mjAttribute('width')) {
      width = mjAttribute('width')
    }

    return helpers.merge({}, baseStyles, {
      div: {
        maxWidth: defaultUnit(width, 'px')
      },
      edge: {
        paddingBottom: `${backgroundRatio}%`
      },
      hero: {
        background: backgroundStyle,
        paddingTop: getPadding('top'),
        paddingLeft: getPadding('left'),
        paddingRight: getPadding('right'),
        paddingBottom: getPadding('bottom'),
        backgroundPosition: mjAttribute('background-position'),
        verticalAlign: mjAttribute('vertical-align')
      }
    })
  }

  isFixedHeight () {
    const { mjAttribute } = this.props

    return mjAttribute('mode') == 'fixed-height'
  }

  renderFixedHeight () {
    const { mjAttribute, children, defaultUnit } = this.props

    return (
      <tr style={this.styles.tr}>
        <td
          className="mj-hero-fixed-height"
          height={this.getFixedHeight()}
          data-background-height={defaultUnit(mjAttribute('height'), 'px')}
          data-legacy-background={mjAttribute('background-url')}
          data-crop={this.getBackgroundCrop()}
          style={this.styles.hero}>
          {children}
        </td>
      </tr>
    )
  }

  renderFluidHeight () {
    const { mjAttribute, children } = this.props

    return (
      <tr style={this.styles.tr}>
        <td style={this.styles.edge} />
        <td
          data-legacy-background={mjAttribute('background-url')}
          style={this.styles.hero}>
          {children}
        </td>
        <td style={this.styles.edge} />
      </tr>
    )
  }

  render () {
    const { mjAttribute, defaultUnit } = this.props
    const divClasses = cx('mj-hero-outlook', mjAttribute('css-class'))

    return (
      <div
        className={divClasses}
        data-background-width={defaultUnit(mjAttribute('background-width'), 'px')}
        data-background-height={defaultUnit(mjAttribute('background-height'), 'px')}
        data-background-url={mjAttribute('background-url')}
        style={this.styles.div}>
        <table
          role="presentation"
          cellPadding="0"
          cellSpacing="0"
          style={this.styles.table}>
          <tbody>
            {this.isFixedHeight() ? this.renderFixedHeight() : this.renderFluidHeight()}
          </tbody>
        </table>
      </div>
    )
  }

}

Hero.tagName = tagName
Hero.defaultMJMLDefinition = defaultMJMLDefinition
Hero.endingTag = endingTag
Hero.baseStyles = baseStyles
Hero.postRender = postRender
Hero.parentTag = parentTag

export default Hero
