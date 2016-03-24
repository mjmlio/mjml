import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-html'
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'padding': 0
  }
}
const endingTag = true
const columnElement = true
const baseStyles = {
  div: {
    fontSize: '13px'
  }
}

@MJMLElement
class Html extends Component {

  styles = this.getStyles()

  getStyles () {
    return merge({}, this.constructor.baseStyles, {})
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
Html.defaultMJMLDefinition = defaultMJMLDefinition
Html.endingTag = endingTag
Html.columnElement = columnElement
Html.baseStyles = baseStyles

export default Html
