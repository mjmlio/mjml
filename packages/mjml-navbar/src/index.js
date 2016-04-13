import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import merge from 'lodash/merge'
import MJMLSection from 'mjml-section'
import React, { Component } from 'react'

const tagName = 'mj-navbar'
const defaultMJMLDefinition = {
  attributes: {
    'padding': '10px 25px',
    'width': '100%',
    'border-top': '5px solid #42adea',
    'border-bottom': '5px solid #42adea'
  }
}
const baseStyles = {
  bar: {
    padding: '10px'
  }
}
const postRender = $ => {
  return $
}

@MJMLElement
class Navbar extends Component {

  styles = this.getStyles()

  constructor (props) {
    super(props)
  }

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, baseStyles, {
      bar: {
        borderTop: mjAttribute('border-top'),
        borderBottom: mjAttribute('border-bottom')
      }
    })
  }

  render () {
    const { mjContent, children } = this.props

    return (
      <MJMLSection full-width="full-width" {...this.props}>
        {children}
      </MJMLSection>
    )
  }

}

Navbar.tagName = tagName
Navbar.defaultMJMLDefinition = defaultMJMLDefinition
Navbar.baseStyles = baseStyles
Navbar.postRender = postRender

export default Navbar
