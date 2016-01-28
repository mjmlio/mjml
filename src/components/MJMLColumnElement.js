import MJMLElement from './MJMLElement'
import React, { Component } from 'react'

function createComponent(ComposedComponent, defaultAttributes) {

  @MJMLElement(defaultAttributes)
  class MJMLColumnElement extends Component {

    getStyles() {
      const { mjAttribute } = this.props

      return {
        td: {
          fontSize: 0,
          paddingTop: mjAttribute('padding-top'),
          paddingBottom: mjAttribute('padding-bottom'),
          paddingRight: mjAttribute('padding-right'),
          paddingLeft: mjAttribute('padding-left'),
          padding: mjAttribute('padding')
        }
      }
    }

    render() {
      const { mjAttribute } = this.props

      this.styles = this.getStyles()

      return (
        <tr>
          <td style={this.styles.td} data-legacy-align={mjAttribute('align')}>
            <ComposedComponent {...this.props} />
          </td>
        </tr>
      )
    }

  }

  return MJMLColumnElement

}

export default (defaultAttributes) => {
  if (typeof defaultAttributes == 'function') {
    return createComponent(defaultAttributes)
  }

  return ComposedComponent => createComponent(ComposedComponent, defaultAttributes)
}
