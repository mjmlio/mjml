import React, { Component } from 'react'
import _ from 'lodash'
import {
  MJMLColumnElement,
  elements,
  registerElement,
} from 'mjml'

/*
 * Wrap your dependencies here.
 */
const {
  text: MjText,
} = elements;

const NAME = 'mock'

@MJMLColumnElement({
  tagName: 'mj-mock',
  content: ' ',

  /*
   * These are your default css attributes
   */
  attributes: {
    'color': '#424242',
    'font-family': 'Helvetica',
    'margin-top': '10px'
  }
})
class Mock extends Component {

  /*
   * Build your styling here
   */
  getStyles() {
    const { mjAttribute, color } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      text: {
        /*
         * Get the color attribute
         * Example: <mj-mock color="blue">content</mj-mock>
         */
        color: mjAttribute('color')
      }
    })
  }

  render() {

    const css = this.getStyles(),
      content = 'Hello World!'

    return (
      <MjText style={ css }>
        { content }
      </MjText>
    )
  }
}

registerElement('mock', Mock)
export default Mock