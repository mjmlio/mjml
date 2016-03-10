import _ from 'lodash'
import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'

/**
 * This tag allows you to display the most basic kind of text in your email
 */
@MJMLColumnElement({
  tagName: 'mj-text',
  content: '',
  attributes: {
    'align': 'left',
    'color': '#000000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px'
  }
})
class Text extends Component {

  static baseStyles = {
    div: {
      cursor: 'auto'
    }
  }

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, color } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      div: {
        color: mjAttribute('locked') ? color : mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        textDecoration: mjAttribute('text-decoration')
      }
    })
  }

  render () {
    const { mjContent } = this.props

    return (
      <div
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        style={this.styles.div} />
    )
  }

}

export default Text
