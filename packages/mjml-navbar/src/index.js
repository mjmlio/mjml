import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import merge from 'lodash/merge'
import MJMLSection from 'mjml-section'
import React, { Component } from 'react'

const tagName = 'mj-navbar'
const defaultMJMLDefinition = {
  attributes: {
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
