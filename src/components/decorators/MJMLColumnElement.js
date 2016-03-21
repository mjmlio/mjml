import _ from 'lodash'
import hoistNonReactStatic from 'hoist-non-react-statics'
import MJMLElement from './MJMLElement'
import React, { Component } from 'react'

function createComponent(ComposedComponent, defaultMJMLDefinition) {

  @MJMLElement(defaultMJMLDefinition)
  class MJMLColumnElement extends Component {

    static baseStyles = {
      td: {
        wordBreak: 'break-word'
      }
    }

    styles = this.getStyles()

    getStyles () {
      const { mjAttribute } = this.props

      return _.merge({}, this.constructor.baseStyles, {
        td: {
          background: mjAttribute('container-background-color'),
          fontSize: 0,
          padding: mjAttribute('padding'),
          paddingTop: mjAttribute('padding-top'),
          paddingBottom: mjAttribute('padding-bottom'),
          paddingRight: mjAttribute('padding-right'),
          paddingLeft: mjAttribute('padding-left')
        }
      })
    }

    render () {
      const { mjAttribute } = this.props

      return (
        <tr>
          <td
            data-legacy-align={mjAttribute('align')}
            data-legacy-background={mjAttribute('container-background-color')}
            style={this.styles.td}>
            <ComposedComponent {...this.props} />
          </td>
        </tr>
      )
    }

  }

  hoistNonReactStatic(MJMLColumnElement, ComposedComponent)

  return MJMLColumnElement

}

export default (defaultMJMLDefinition) => {
  if (typeof defaultMJMLDefinition == 'function') {
    return createComponent(defaultMJMLDefinition)
  }

  return ComposedComponent => createComponent(ComposedComponent, defaultMJMLDefinition)
}
