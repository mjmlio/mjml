import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'
import _ from 'lodash'

/**
 * Displays a customizable divider
 */
@MJMLColumnElement({
  tagName: 'mj-divider',
  attributes: {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    'horizontal-spacing': '10px',
    'padding': '10px 25px',
    'vertical-spacing': '30px',
    'width': '150px'
  }
})
class Divider extends Component {

  static baseStyles = {
    p: {
      fontSize: '1px',
      margin: '0'
    }
  };

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      p: {
        borderTop: `${mjAttribute('border-width')} ${mjAttribute('border-style')} ${mjAttribute('border-color')}`,
        width: "100%"
      }
    })
  }

  render() {
    this.styles = this.getStyles()

    return <p className="outlook-divider-fix" style={this.styles.p} />
  }

}

export default Divider
