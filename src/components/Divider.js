import _ from 'lodash'
import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'

/**
 * Displays a customizable divider
 */
@MJMLColumnElement({
  tagName: 'mj-divider',
  attributes: {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    'padding': '10px 25px',
    'width': '100%'
  }
})
class Divider extends Component {

  static baseStyles = {
    p: {
      fontSize: '1px',
      margin: '0 auto'
    }
  };

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      p: {
        borderTop: `${mjAttribute('border-width')} ${mjAttribute('border-style')} ${mjAttribute('border-color')}`,
        width: mjAttribute('width')
      }
    })
  }

  render () {
    return (
      <p
        className="mj-divider-outlook"
        style={this.styles.p} />
    )
  }

}

export default Divider
