import MJMLElement from './decorators/MJMLElement'
import React, { Component } from 'react'

/**
 * Displays raw html
 */
@MJMLElement({
  tagName: 'mj-html',
  content: ' ',
  attributes: {
    'html': true,
    'padding-bottom': '10px',
    'padding-left': '0',
    'padding-right': '0',
    'padding-top': '10px'
  }
})
class Html extends Component {

  render() {
    const { mjContent } = this.props

    return (
      <div
        className="mj-content"
        dangerouslySetInnerHTML={{ __html: mjContent() }} />
    )
  }

}

export default Html
