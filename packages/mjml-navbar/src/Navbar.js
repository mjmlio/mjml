import { MJMLElement } from 'mjml-core'
import MJMLSection from 'mjml-section'
import React, { Component } from 'react'

const tagName = 'mj-navbar'
const defaultMJMLDefinition = {
  attributes: {
    'navbar-hamburger': '',
    'padding': '10px 25px',
    'width': '100%'
  }
}

@MJMLElement
class Navbar extends Component {

  render () {
    const { children } = this.props

    return (
      <MJMLSection full-width="full-width" {...this.props}>
        {children}
      </MJMLSection>
    )
  }

}

Navbar.tagName = tagName
Navbar.defaultMJMLDefinition = defaultMJMLDefinition

export default Navbar
