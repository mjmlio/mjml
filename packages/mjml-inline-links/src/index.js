import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import merge from 'lodash/merge'
import url from 'url'
import React, { Component } from 'react'

const tagName = 'mj-inline-links'
const defaultMJMLDefinition = {
  attributes: {
    'align': 'center'
  }
}
const baseStyles = {
  div: {
    'width': '100%'
  }
}
const columnElement = true
const postRender = $ => {
  $('.mj-inline-links').each(function () {
    $(this)
      .prepend(`<!--[if gte mso 9]>
			  <table border="0" cellpadding="0" cellspacing="0" align="${$(this).data('align')}">
          <tr>
		  <![endif]-->`)
      .append(`<!--[if gte mso 9]>
          </tr>
        </table>
      <![endif]-->`)
      .removeAttr('data-align')
  })

  return $
}

@MJMLElement
class InlineLinks extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, baseStyles, {
      div: {
        textAlign: mjAttribute('align')
      }
    })
  }

  renderChildren () {
    const { children, mjAttribute } = this.props
    const baseUrl = mjAttribute('base-url')
    const perform = (mjml) => {
      if (mjml.get('tagName') === 'mj-link') {
        mjml = mjml.setIn(['attributes', 'href'], url.resolve(baseUrl, mjml.getIn(['attributes', 'href'])))
      }
      return mjml
    }

    return children.map(child => React.cloneElement(child, { mjml: perform(child.props.mjml) }))
  }

  render () {
    const { mjAttribute } = this.props

    return (
      <div
        className="mj-inline-links"
        style={this.styles.div}
        data-align={mjAttribute('align')}
      >
        {this.renderChildren()}
      </div>
    )
  }
}

InlineLinks.tagName = tagName
InlineLinks.defaultMJMLDefinition = defaultMJMLDefinition
InlineLinks.baseStyles = baseStyles
InlineLinks.columnElement = columnElement
InlineLinks.postRender = postRender

export default InlineLinks
