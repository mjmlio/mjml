import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-list'
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
    'color': '#000000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px'
  }
}
const endingTag = true
const baseStyles = {
  ul: {
    display: 'inline-block',
    paddingLeft: '20px',
    textAlign: 'left'
  }
}

@MJMLElement
class List extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return merge({}, baseStyles, {
      ul: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size'), "px"),
        lineHeight: mjAttribute('line-height')
      }
    })
  }

  render () {
    const { mjContent } = this.props

    return (
      <ul
        dangerouslySetInnerHTML={{ __html: mjContent() }}
        style={this.styles.ul} />
    )
  }

}

List.tagName = tagName
List.defaultMJMLDefinition = defaultMJMLDefinition
List.endingTag = endingTag
List.baseStyles = baseStyles

export default List
