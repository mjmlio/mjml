import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-link'
const defaultMJMLDefinition = {
  attributes: {
    'padding': '15px 10px',
    'color': '#000000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'font-weight': 'normal',
    'line-height': '22px'
  }
}
const baseStyles = {
  a: {
    display: 'inline-block',
    textDecoration: 'none',
    textTransform: 'uppercase'
  }
}
const endingTag = true
const postRender = $ => {
  $('.mj-link')
    .each(function () {
      $(this)
        .before(`<!--[if gte mso 9]>
          <td style="padding: ${$(this).data('padding')}">
        <![endif]-->`)
        .after(`<!--[if gte mso 9]>
          </td>
        <![endif]-->`)
        .removeAttr('data-padding')
        .removeAttr('class')
    })

  return $
}

@MJMLElement
class Link extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, baseStyles, {
      a: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        textDecoration: mjAttribute('text-decoration'),
        textTransform: mjAttribute('text-transform'),
        padding: mjAttribute('padding'),
        paddingTop: mjAttribute('padding-top'),
        paddingLeft: mjAttribute('padding-left'),
        paddingRight: mjAttribute('padding-right'),
        paddingBottom: mjAttribute('padding-bottom')
      }
    })
  }

  render () {
    const { mjAttribute, mjContent } = this.props

    return (
      <a
        className="mj-link"
        href={mjAttribute('href')}
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        style={this.styles.a}
        data-padding={this.styles.a.padding}
      />
    )
  }

}

Link.tagName = tagName
Link.defaultMJMLDefinition = defaultMJMLDefinition
Link.baseStyles = baseStyles
Link.endingTag = endingTag
Link.postRender = postRender

export default Link
