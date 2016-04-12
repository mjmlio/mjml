import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-navbar-link'
const defaultMJMLDefinition = {
  attributes: {
    'padding': '10px 25px',
    'width': '100%'
  }
}
const baseStyles = {
  bar: {}
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

    return merge({}, baseStyles, {})
  }

  render () {
    const { mjAttribute, mjContent } = this.props

    return (
      <a href={mjAttribute('href')}>{mjContent()}</a>
    )
  }

}

NavbarLink.tagName = tagName
NavbarLink.defaultMJMLDefinition = defaultMJMLDefinition
NavbarLink.baseStyles = baseStyles
NavbarLink.postRender = postRender
NavbarLink.endingTag = endingTag

export default NavbarLink
