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
    'padding-bottom': '10px',
    'padding-left': '25px',
    'padding-right': '25px',
    'padding-top': '10px',
    'vertical-spacing': '30px',
    'width': '150px'
  }
})
class Divider extends Component {

  static baseStyles = {
    p: {
      fontSize: '1px'
    }
  };

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      p: {
        borderTop: `${mjAttribute('border-width')} ${mjAttribute('border-style')} ${mjAttribute('border-color')}`,
        paddingBottom: mjAttribute('vertical-spacing'),
        paddingLeft: mjAttribute('horizontal-spacing'),
        paddingRight: mjAttribute('horizontal-spacing'),
        paddingTop: mjAttribute('vertical-spacing'),
        width: "100%"
      }
    })
  }

  render() {
    this.styles = this.getStyles()

    return <p style={this.styles.p} />
  }

}

export default Divider
