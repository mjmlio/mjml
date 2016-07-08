import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-list'
const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const defaultMJMLDefinition = {
  content: '',
  attributes: {
    'align': 'left',
    'color': '#000000',
    'container-background-color': null,
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'vertical-align': null
  }
}
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
        fontSize: defaultUnit(mjAttribute('font-size')),
        lineHeight: defaultUnit(mjAttribute('line-height'))
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
List.parentTag = parentTag
List.endingTag = endingTag
List.defaultMJMLDefinition = defaultMJMLDefinition
List.baseStyles = baseStyles

export default List
