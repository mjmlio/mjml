import { MJMLElement } from 'mjml-core'
import React, { Component } from 'react'

const tagName = 'mj-spacer'
const defaultMJMLDefinition = {
  attributes: {
    'height': '20px'
  }
}
const columnElement = true

@MJMLElement
class Spacer extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return {
      div: {
        fontSize: '1px',
        lineHeight: defaultUnit(mjAttribute('height'), 'px')
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
Spacer.defaultMJMLDefinition = defaultMJMLDefinition
Spacer.columnElement = columnElement

export default Spacer
