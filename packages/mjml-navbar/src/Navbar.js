import { MJMLElement } from 'mjml-core'
import MJMLSection from 'mjml-section'
import React, { Component } from 'react'

const tagName = 'mj-navbar'
const parentTag = ['mj-container']
const defaultMJMLDefinition = {
  attributes: {
    'background-color': null,
    'background-url': null,
    'background-repeat': 'repeat',
    'background-size': 'auto',
    'border': null,
    'border-bottom': null,
    'border-left': null,
    'border-radius': null,
    'border-right': null,
    'border-top': null,
    'full-width': null,
    'padding': '10px 25px',
    'padding-top': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'text-align': 'center',
    'vertical-align': 'top'
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
Navbar.parentTag = parentTag

export default Navbar
