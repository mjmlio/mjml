import { MJMLElement } from '../src/index'
import React, { Component } from 'react'

const tagName = 'mj-mock-list'
const parentTag = ['mj-body']
const defaultMJMLDefinition = {
  attributes: {
  }
}

@MJMLElement
class MockListComponent extends Component {
  render () {
    return (
      <div className="mj-mock-list">
        {this.props.children}
      </div>
    )
  }
}

MockListComponent.tagName = tagName
MockListComponent.parentTag = parentTag
MockListComponent.defaultMJMLDefinition = defaultMJMLDefinition

export default MockListComponent
