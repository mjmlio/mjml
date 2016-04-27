import { MJMLElement } from '../src/index'
import React, { Component } from 'react'

const tagName = 'mj-mock'
const endingTag = true
const defaultMJMLDefinition = {
}

@MJMLElement
class MockComponent extends Component {
  render () {
    return (
      <div className="mj-mock">
        Mocked Component!
      </div>
    )
  }
}

MockComponent.tagName = tagName
MockComponent.endingTag = endingTag
MockComponent.defaultMJMLDefinition = defaultMJMLDefinition

export default MockComponent
