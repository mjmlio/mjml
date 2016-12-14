import { MJMLElement } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-spacer'
const parentTag = ['mj-column', 'mj-hero-content']
const selfClosingTag = true
const defaultMJMLDefinition = {
  attributes: {
    'align': null,
    'container-background-color': null,
    'height': '20px',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'vertical-align': null
  }
}

@MJMLElement
class Spacer extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return {
      div: {
        fontSize: '1px',
        lineHeight: defaultUnit(mjAttribute('height')),
        whiteSpace: 'nowrap'
      }
    }
  }

  render () {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: '&nbsp;' }}
        style={this.styles.div} />
    )
  }

}

Spacer.tagName = tagName
Spacer.parentTag = parentTag
Spacer.selfClosingTag = selfClosingTag
Spacer.defaultMJMLDefinition = defaultMJMLDefinition

export default Spacer
