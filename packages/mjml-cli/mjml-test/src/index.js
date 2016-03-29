import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import MJMLText from 'mjml-text'
import React, { Component } from 'react'

const tagName = 'mjmltest'
const endingTag = false
const columnElement = false

/*
 * Add your default mjml-attributes here
 */
const defaultMJMLDefinition = {
  attributes: {
    'color': '#424242',
    'font-family': 'Helvetica',
    'margin-top': '10px'
  }
}

/*
 * Add you default style here
 */
const baseStyles = {
  div: {
    cursor: 'auto'
  }
}

@MJMLElement
class MjmlTest extends Component {

  /*
   * Build your styling here
   */
  getStyles () {
    const { mjAttribute, color } = this.props

    return merge({}, this.constructor.baseStyles, {
      text: {
      /*
       * Get the color attribute
       * Example: <mj-mjmltest color="blue">content</mj-mjmltest>
       */
        color: mjAttribute('color')
      }
    })
  }

  render () {
    const css = this.getStyles()
    const content = 'Hello World!'

    return (
      <MJMLText style={css}>
        {content}
      </MJMLText>
    )
  }

}

MjmlTest.tagName = tagName
MjmlTest.defaultMJMLDefinition = defaultMJMLDefinition
MjmlTest.endingTag = endingTag
MjmlTest.columnElement = columnElement
MjmlTest.baseStyles = baseStyles

export default MjmlTest

