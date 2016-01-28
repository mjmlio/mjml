import MJMLColumnElement from './MJMLColumnElement'
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
    'border-width': '4px 0 0',
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
    div: {
      height: '0',
      fontSize: '1px'
    }
  };

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      div: {
        borderColor: mjAttribute('border-color'),
        borderStyle: mjAttribute('border-style'),
        borderWidth: mjAttribute('border-width'),
        marginBottom: mjAttribute('vertical-spacing'),
        marginLeft: mjAttribute('horizontal-spacing'),
        marginRight: mjAttribute('horizontal-spacing'),
        marginTop: mjAttribute('vertical-spacing')
      }
    })
  }

  render() {
    this.styles = this.getStyles()

    return <div style={this.styles.div} />
  }

}

export default Divider
