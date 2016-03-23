import { widthParser } from '../mjml/src/helpers/mjAttribute'
import {MJMLElement} from '../mjml/src/index'
import React, { Component } from 'react'

/**
 * This is the starting point of your email. It is a unique and mandatory component. It corresponds to the HTML <body> tag.
 */
@MJMLElement({
  tagName: 'mj-body',
  attributes: {
    'width': '600'
  },
  inheritedAttributes: [
    'width'
  ]
})
class Body extends Component {

  static tagName = "mj-body"

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute } = this.props

    return {
      div: {
        backgroundColor: mjAttribute('background-color'),
        fontSize: mjAttribute('font-size')
      }
    }
  }

  render () {
    const { renderWrappedOutlookChildren, mjAttribute, children } = this.props
    const { width } = widthParser(mjAttribute('width'))

    return (
      <div
        className="mj-body"
        data-background-color={mjAttribute('background-color')}
        data-width={width}
        style={this.styles.div}>
        {renderWrappedOutlookChildren(children)}
      </div>
    )
  }

}

export default Body
