import { MJMLElement } from 'mjml-core'
import { widthParser } from 'mjml-core/helpers'
import React, { Component } from 'react'

const tagName = 'mj-body'
const defaultMJMLDefinition = {
  attributes: {
    'width': '600'
  },
  inheritedAttributes: [
    'width'
  ]
}

@MJMLElement
class Body extends Component {

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

Body.tagName = tagName
Body.defaultMJMLDefinition = defaultMJMLDefinition

export default Body
