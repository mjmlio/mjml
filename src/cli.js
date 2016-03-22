import { mjml2html, version as V } from './index'
import fs from 'fs'

const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase().replace(/-/g, '')

/*
 * The version number is the NPM
 * version number. It should be the same as the MJML engine
 */
export const version = V

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
const error = e => console.log(e.stack ? e.stack : e)

/*
 * Stdin to string buffer
 */
const stdinToBuffer = (stream, callback) => {
  let buffer = ''

  stream.on('data', chunck => {
    buffer += chunck
  })

  stream.on('end', () => {
    callback(null, buffer)
  })
}

/*
 * Utility functions
 * write: write to a file
 * read: read a fileexists: ensure the file exists
 */
const write     = promisify(fs.writeFile)
const read      = promisify(fs.readFile)
const exists    = promisify((file, cb) => fs.access(file, fs.R_OK | fs.W_OK, cb))
const readStdin = promisify(stdinToBuffer)

/*
 * Render an input promise
 */
const render = (bufferPromise, { min, output, stdout }) => {
  bufferPromise
    .then(mjml => mjml2html(mjml.toString(), { minify: min }))
    .then(result => stdout ? process.stdout.write(result) : write(output, result))
    .catch(error)
}

/*
 * Turns an MJML input file into a pretty HTML file
 * min: boolean that specify the output format (pretty/minified)
 */
export const renderFile = (input, options) => render(exists(input).then(() => read(input)), options)

/**
 * Render based on input stream
 */
export const renderStream = options => render(readStdin(process.stdin), options)

/*
 * Watch changes on a specific input file by calling render on each change
 */
export const watch = (input, options) =>
    fs.watchFile(input, () =>
      renderFile(input, options))

/*
* Return the code of an MJML component for a given name
*/
const createComponent = (name, ending) => {
  const lowerName = name.toLowerCase()

  return `
import { MJMLColumnElement, elements, registerElement } from 'mjml'
import merge from 'lodash/merge'
import React, { Component } from 'react'

/*
 * Wrap your dependencies here.
 */
const { text: MjText } = elements

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
  getStyles () {
    const { mjAttribute, color } = this.props

    return merge({}, this.constructor.baseStyles, {
      text: {
      /*
       * Get the color attribute
       * Example: <mj-${lowerName} color="blue">content</mj-${lowerName}>
       */
        color: mjAttribute('color')
      }
    })
  }

  render () {
    const css = this.getStyles()
    const content = 'Hello World!'

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
export const initComponent = (name, ending) =>
  write(`./${capitalize(name)}.js`, createComponent(capitalize(name), ending))
    .then(() => console.log(`Component created: ${capitalize(name)}`))
