import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import React, { Component } from 'react'

const tagName = 'mj-body'
const defaultMJMLDefinition = {
  attributes: {
    'width': '600'
  },
  inheritedAttributes: [
    'width'
  ]
}
const postRender = $ => {
  const bodyWidth = $('.mj-body').data('width')

  $('.mj-body-outlook-open').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0" width="${bodyWidth}" align="center" style="width:${bodyWidth}px;"><tr><td>
      <![endif]-->`)
  })

  $('.mj-body-outlook-line').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
      <![endif]-->
      <!--[if mso]>
      <table border="0" cellpadding="0" cellspacing="0" width="${bodyWidth}" align="center" style="width:${bodyWidth}px;"><tr><td>
      <![endif]-->`)
  })

  $('.mj-body-outlook-close').each(function () {
    $(this).replaceWith(`<!--[if mso]>
      </td></tr></table>
      <![endif]-->`)
  })

  $('body')
    .css({ background: $('.mj-body').data('background-color') })
    .each(function () {
      if ($(this).attr('style') === '') {
        $(this).removeAttr('style')
      }
    })

  $('.mj-body')
    .removeAttr('data-background-color')
    .removeAttr('data-width')
    .removeAttr('class')

  return $
}

@MJMLElement
class Body extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return {
      div: {
        backgroundColor: mjAttribute('background-color'),
        fontSize: mjAttribute('font-size')
      }
    }
  }

  render () {
    const { renderWrappedOutlookChildren, mjAttribute, children } = this.props
    const { width } = widthParser(mjAttribute('width'))

    return (
      <div
        className="mj-body"
        data-background-color={mjAttribute('background-color')}
        data-width={width}
        style={this.styles.div}>
        {renderWrappedOutlookChildren(children)}
      </div>
    )
  }

}

Body.tagName = tagName
Body.defaultMJMLDefinition = defaultMJMLDefinition
Body.postRender = postRender

export default Body
