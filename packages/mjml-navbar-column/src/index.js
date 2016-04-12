import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/lib/helpers'
import MJMLColumn from 'mjml-column'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-navbar-column'
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

@MJMLElement
class NavbarColumn extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return merge({}, baseStyles, {})
  }

  render () {
    const { children } = this.props

    return (
      <MJMLColumn {...this.props}>
        <tr><td>
          {children}
        </td></tr>
      </MJMLColumn>
    )
  }

}

NavbarColumn.tagName = tagName
NavbarColumn.defaultMJMLDefinition = defaultMJMLDefinition
NavbarColumn.baseStyles = baseStyles
NavbarColumn.postRender = postRender

export default NavbarColumn
