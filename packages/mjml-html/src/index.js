import { MJMLElement, helpers } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-html'
const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': null,
    'container-background-color': null,
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '0px',
    'vertical-align': null
  }
}
const baseStyles = {
  div: {
    fontSize: '13px'
  }
}

@MJMLElement
class Html extends Component {

  styles = this.getStyles()

  getStyles () {
    return helpers.merge({}, baseStyles, {})
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

Html.tagName = tagName
Html.parentTag = parentTag
Html.endingTag = endingTag
Html.defaultMJMLDefinition = defaultMJMLDefinition
Html.baseStyles = baseStyles

export default Html
