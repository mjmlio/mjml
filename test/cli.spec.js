/**
 *
 *  MJML CLI test suite.
 *
 *
 *  Compile and run the tests:
 *    npm test
 *
 */
import path from 'path'
import fs from 'fs'
import cheerio from 'cheerio'
import { expect } from 'chai'

import mjmlCLI from '../src/cli'

describe('MJML Command Line Interface', () => {
  it('should generate a component code', (done) => {
    const name = 'Mock'
    const lowerName = name.toLowerCase()

    mjmlCLI.initComponent(name, false, false).then(() => {
      fs.readFile(`./${name}.js`, 'utf-8', (err, data) => {
        if(err) {
          assert.fail()
        }
expect(data).to.equal(
`
import React, { Component } from 'react'
import _ from 'loadash'
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
`
)
        fs.unlink(`./${name}.js`)
        done()
      })
    })
  })
})
