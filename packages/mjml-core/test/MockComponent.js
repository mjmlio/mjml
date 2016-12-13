import React, { Component } from 'react'
import { MJMLElement } from '../src/index'

const tagName = 'mj-mock'
const endingTag = true
const parentTag = ['mj-mock-list']
const defaultMJMLDefinition = {
  attributes: {

  }
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
MockComponent.parentTag = parentTag
MockComponent.defaultMJMLDefinition = defaultMJMLDefinition

export default MockComponent
