import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import merge from 'lodash/merge'
import MJMLColumn from 'mjml-column'
import MJMLSection from 'mjml-section'
import MJMLText from 'mjml-text'
import React, { Component } from 'react'
import url from 'url'

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

  renderChildren () {
    const baseUrl = this.props.mjAttribute('base-url')
    const perform = (mjml) => {
      if (mjml && mjml.get('tagName') === 'mj-navbar-link') {
        mjml = mjml.setIn(['attributes', 'href'], url.resolve(baseUrl, mjml.getIn(['attributes', 'href'])))
      } else if (mjml.has('children')) {
        mjml = mjml.set('children', mjml.get('children').map(perform))
      }
      return mjml
    }

    return this.props.children.map(child => React.cloneElement(child, { mjml: perform(child.props.mjml) }))
  }

  render () {
    const { mjContent, children } = this.props

    return (
      <MJMLSection full-width="full-width" {...this.props}>
        <div style={this.styles.bar}>
          {this.renderChildren()}
        </div>
      </MJMLSection>
    )
  }

}

Navbar.tagName = tagName
Navbar.defaultMJMLDefinition = defaultMJMLDefinition
Navbar.baseStyles = baseStyles
Navbar.postRender = postRender

export default Navbar
