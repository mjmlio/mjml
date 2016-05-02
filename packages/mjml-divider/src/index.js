import { MJMLElement, helpers } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-divider'
const defaultMJMLDefinition = {
  attributes: {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    'padding': '10px 25px',
    'width': '100%'
  }
}
const columnElement = true
const baseStyles = {
  p: {
    fontSize: '1px',
    margin: '0 auto'
  }
}
const postRender = $ => {
  $('.mj-divider-outlook').each(function () {
    const insertNode = `<table align="center" border="0" cellpadding="0" cellspacing="0" style="${$(this).attr('style')}" width="${$(this).data('divider-width')}"><tr><td style="height:0;line-height:0;">&nbsp;</td></tr></table>`

    $(this)
      .removeAttr('data-divider-width')
      .removeAttr('class')
      .after(`<!--[if mso]>${insertNode}<![endif]-->`)
  })

  return $
}

@MJMLElement
class Divider extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, baseStyles, {
      p: {
        borderTop: `${mjAttribute('border-width')} ${mjAttribute('border-style')} ${mjAttribute('border-color')}`,
        width: mjAttribute('width')
      }
    })
  }

  outlookWidth () {
    const { mjAttribute } = this.props
    const parentWidth = parseInt(mjAttribute('parentWidth'))
    const { width, unit } = helpers.widthParser(mjAttribute('width'))

    switch (unit) {
      case '%': {
        return parentWidth * width / 100
      }
      default: {
        return width
      }
    }
  }

  render () {
    return (
      <p
        className="mj-divider-outlook"
        data-divider-width={this.outlookWidth()}
        style={this.styles.p} />
    )
  }

}

Divider.tagName = tagName
Divider.defaultMJMLDefinition = defaultMJMLDefinition
Divider.columnElement = columnElement
Divider.baseStyles = baseStyles
Divider.postRender = postRender

export default Divider
