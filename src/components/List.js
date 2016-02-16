import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'
import _ from 'lodash'

/**
 * mj-list enable you to create an unordered or ordered list
 */
@MJMLColumnElement({
  tagName: 'mj-list',
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
class List extends Component {

  static baseStyles = {
    ul: {
      display: 'inline-block',
      paddingLeft: '20px',
      textAlign: 'left'
    }
  };

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      ul: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        lineHeight: mjAttribute('line-height')
      }
    })
  }

  render() {
    const { mjContent } = this.props

    this.styles = this.getStyles()

    return (
      <ul
        className="mj-content"
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        style={this.styles.ul} />
    )
  }

}

export default List
