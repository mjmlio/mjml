import fs                      from 'fs'
import minify                  from 'html-minify'
import mjmlEngine              from './index'
import { version as VERSION }  from '../package.json'

const engine = mjmlEngine.mjml2html

/*
 * The version number is the NPM
 * version number. It should be the same as the MJML engine
 */
const version = () => VERSION

/*
 * Turns a callback style to a Promise style one
 */
const promisify = fn =>
  (...args) =>
    new Promise((resolve, reject) =>
      fn(...args.concat((err, ...data) =>
        err ? reject(err) : resolve(...data))))

/*
 * Minimal Error Handling
 */
const error   = (e) => {
  console.log(e.stack ? e.stack : e)
}

/*
 * Utility functions
 * write: write to a file
 * read: read a fileexists: ensure the file exists
 */
const write   = promisify(fs.writeFile)
const read    = promisify(fs.readFile)
const exists  = promisify((file, cb) => fs.access(file, fs.R_OK | fs.W_OK, cb))

/*
 * Turns an MJML input file into a pretty HTML file
 * min: boolean that specify the output format (pretty/minified)
 */
const render = (input, { min, output }) => {
  exists(input)
    .then(()      => read(input))
    .then(mjml    => engine(mjml.toString()))
    .then(html    => min ? minify(html) : html)
    .then(result  => write(output, result))
    .catch(error)
}

/*
 * Watch changes on a specific input file by calling render on each change
 */
const watch = (input, options) =>
  fs.watch(input, () =>
    render(input, options))

const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase().replace(/-/g, '')

/*
* Return the code of an MJML component for a given name
*/
const createComponent = (name, ending) => {
  const lowerName = name.toLowerCase()

  return `
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

const NAME = '${lowerName}'

@MJMLColumnElement({
  tagName: 'mj-${lowerName}',
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
class ${name} extends Component {

  /*
   * Build your styling here
   */
  getStyles() {
    const { mjAttribute, color } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      text: {
      /*
       * Get the color attribute
       * Example: <mj-${lowerName} color="blue">content</mj-${lowerName}>
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

registerElement('${lowerName}', ${name}${ending ? ', { endingTag: true }' : ''})
export default ${name}
`
}

/*
 * Create a new component based on the default template
 */
const initComponent = (name, ending) =>
  write(`./${capitalize(name)}.js`, createComponent(capitalize(name), ending))
    .then(() => console.log(`Component created: ${capitalize(name)}`))

module.exports = {
  initComponent: initComponent,
  render: render,
  watch: watch,
  version: version
}
