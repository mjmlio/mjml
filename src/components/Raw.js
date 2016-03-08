import MJMLElement from './decorators/MJMLElement'
import React, { Component } from 'react'

@MJMLElement({
  tagName: 'mj-raw'
})
class Raw extends Component {

  getTagName () {
    const { parentMjml } = this.props
    let tagName

    switch (parentMjml.get('tagName')) {
      case 'mj-column' :
        tagName = 'tr'
        break

      default:
        tagName = 'noscript'
    }

    return tagName
  }

  render () {
    const { mjContent } = this.props

    return React.createElement(this.getTagName(), {
      className: 'mj-raw',
      dangerouslySetInnerHTML: { __html: mjContent() }
    })
  }

}

export default Raw
