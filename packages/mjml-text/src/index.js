import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-text'
const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
    'color': '#000000',
    'container-background-color': null,
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'font-style': null,
    'font-weight': null,
    'line-height': '22px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'text-decoration': null,
    'text-transform': null,
    'vertical-align': null
  }
}
const baseStyles = {
  div: {
    cursor: 'auto'
  }
}

@MJMLElement
class Text extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return helpers.merge({}, baseStyles, {
      div: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size')),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: defaultUnit(mjAttribute('line-height'), "px"),
        textDecoration: mjAttribute('text-decoration'),
        textTransform: mjAttribute('text-transform')
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
Text.parentTag = parentTag
Text.endingTag = endingTag
Text.defaultMJMLDefinition = defaultMJMLDefinition
Text.baseStyles = baseStyles

export default Text
