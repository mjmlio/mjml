import MJMLElement from './decorators/MJMLElement'
import React, { Component } from 'react'

@MJMLElement({
  tagName: 'mj-raw'
})
class Raw extends Component {

  render () {
    const { mjContent } = this.props

    return (
      <tr
        className="mj-raw"
        dangerouslySetInnerHTML={{ __html: mjContent() }} />
    )
  }

}

export default Raw
