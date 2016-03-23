import _ from 'lodash'
import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'

/**
 * Displays raw html
 */
@MJMLColumnElement({
  tagName: 'mj-html',
  content: '',
  attributes: {
    'padding': 0
  }
})
class Html extends Component {

  static baseStyles = {
    div: {
      fontSize: '13px'
    }
  }

  styles = this.getStyles()

  getStyles () {
    return _.merge({}, this.constructor.baseStyles, {})
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

export default Html
