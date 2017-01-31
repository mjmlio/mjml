import { MJMLElement } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-raw'
const parentTag = ['mj-body', 'mj-container', 'mj-wrapper', 'mj-section', 'mj-column']
const endingTag = true
const rawElement = true
const defaultMJMLDefinition = {
  attributes: {
  }
}
const postRender = $ => {
  $('.mj-raw').each(function () {
    $(this).replaceWith($(this).html())
  })

  return $
}

@MJMLElement
class Raw extends Component {

  getTagName () {
    const { parentMjml } = this.props

    switch (parentMjml.get('tagName')) {
      case 'mj-column':
        return 'tr'

      default:
        return 'noscript'
    }
  }

  render () {
    const { mjContent } = this.props

    return React.createElement(this.getTagName(), {
      className: 'mj-raw',
      dangerouslySetInnerHTML: { __html: mjContent() }
    })
  }

}

Raw.tagName = tagName
Raw.parentTag = parentTag
Raw.endingTag = endingTag
Raw.rawElement = rawElement
Raw.postRender = postRender
Raw.defaultMJMLDefinition = defaultMJMLDefinition

export default Raw
