import MJMLElement from './decorators/MJMLElement'
import React, { Component } from 'react'

@MJMLElement
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
