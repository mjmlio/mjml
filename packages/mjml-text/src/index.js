import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-text'
const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
    'color': '#000000',
    'container-background-color': null,
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'font-style': null,
    'font-weight': null,
    'line-height': '22px',
    'height': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'text-decoration': null,
    'text-transform': null,
    'vertical-align': null
  }
}
const baseStyles = {
  div: {
    cursor: 'auto'
  }
}

const postRender = $ => {
  $('.mj-text-height').each(function () {

    const height = parseInt($(this).css('height'))

    $(`${helpers.startConditionalTag}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="${height}" style="vertical-align:top;height:${height}px;">
      ${helpers.endConditionalTag}`).insertBefore($(this))

    $(`${helpers.startConditionalTag}
      </td></tr></table>
      ${helpers.endConditionalTag}`).insertAfter($(this))
    $(this).removeClass('mj-text-height').filter('[class=""]').removeAttr('class')
  })
  return $
}

@MJMLElement
class Text extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return helpers.merge({}, baseStyles, {
      div: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size')),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        letterSpacing: defaultUnit(mjAttribute('letter-spacing'), "px"),
        height: defaultUnit(mjAttribute('height'), "px"),
        textAlign: mjAttribute('align'),
        textDecoration: mjAttribute('text-decoration'),
        textTransform: mjAttribute('text-transform')
      }
    })
  }

  render () {
    const { mjAttribute, mjContent } = this.props

    const classNames = mjAttribute('height') ? 'mj-text-height' : ''

    return (
      <div
        className={classNames}
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        style={this.styles.div} />
    )
  }

}

Text.tagName = tagName
Text.parentTag = parentTag
Text.endingTag = endingTag
Text.defaultMJMLDefinition = defaultMJMLDefinition
Text.baseStyles = baseStyles
Text.postRender = postRender

export default Text
