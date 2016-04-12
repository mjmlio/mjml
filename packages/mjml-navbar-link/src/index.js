import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-navbar-link'
const defaultMJMLDefinition = {
  attributes: {
    'padding': '15px 10px',
    'color': '#000000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px'
  }
}
const baseStyles = {
  a: {
    textDecoration: 'none',
    textTransform: 'uppercase'
  }
}
const postRender = $ => {
  return $
}
const endingTag = true

@MJMLElement
class NavbarLink extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, baseStyles, {
      a: {
        display: 'inline-block',
        padding: mjAttribute('padding'),
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        lineHeight: mjAttribute('line-height')
      }
    })
  }

  render () {
    const { mjAttribute, mjContent } = this.props

    return (
      <a
        href={mjAttribute('href')}
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        style={this.styles.a}
      />
    )
  }

}

NavbarLink.tagName = tagName
NavbarLink.defaultMJMLDefinition = defaultMJMLDefinition
NavbarLink.baseStyles = baseStyles
NavbarLink.postRender = postRender
NavbarLink.endingTag = endingTag

export default NavbarLink
