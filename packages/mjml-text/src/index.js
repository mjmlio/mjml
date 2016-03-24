import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-text'
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
    'color': '#000000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px'
  }
}
const endingTag = true
const columnElement = true
const baseStyles = {
  div: {
    cursor: 'auto'
  }
}

@MJMLElement
class Text extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, color } = this.props

    return merge({}, this.constructor.baseStyles, {
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

Text.tagName = tagName
Text.defaultMJMLDefinition = defaultMJMLDefinition
Text.endingTag = endingTag
Text.columnElement = columnElement
Text.baseStyles = baseStyles

export default Text
