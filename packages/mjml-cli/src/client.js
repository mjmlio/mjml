import { MJMLRenderer, version as V } from 'mjml-core'
import camelCase from 'lodash/camelCase'
import createComponent from './createComponent'
import fs from 'fs'
import upperFirst from 'lodash/upperFirst'

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
const mkdir     = promisify(fs.mkdir)
const read      = promisify(fs.readFile)
const exists    = promisify((file, cb) => fs.access(file, fs.R_OK | fs.W_OK, cb))
const readStdin = promisify(stdinToBuffer)

/*
 * Render an input promise
 */
const render = (bufferPromise, { min, output, stdout }) => {
  bufferPromise
    .then(mjml => new MJMLRenderer(mjml.toString(), { minify: min }).render())
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
export const watch = (input, options) => fs.watchFile(input, () => render(input, options))

/*
 * Create a new component based on the default template
 */
export const initComponent = (name, ending, columnElement) => {
  console.log(upperFirst(camelCase(name)))

  mkdir(`./${name}`)
  .then(() => mkdir(`./${name}/src`))
  .then(() => write(`./${name}/src/index.js`, createComponent(upperFirst(camelCase(name)), ending, columnElement)))
  .then(() => console.log(`Component created: ${name}`))
}
