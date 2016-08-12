import { MJMLRenderer, version } from 'mjml-core'
import camelCase from 'lodash/camelCase'
import createComponent from './createComponent'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import upperFirst from 'lodash/upperFirst'

/*
 * The version number is the NPM
 * version number. It should be the same as the MJML engine
 */
export { version }

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
const error = e => console.log(e.stack || e) // eslint-disable-line no-console

const isDirectory = (file) => {
  try {
    const outputPath = path.resolve(process.cwd(), file)
    return fs.statSync(outputPath).isDirectory()
  } catch (e) {
    return false
  }
}

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
const readStdin = promisify(stdinToBuffer)

/*
 * Render an input promise
 */
const render = (bufferPromise, { min, output, stdout, fileName, validationLevel }) => {
  bufferPromise
    .then(mjml => new MJMLRenderer(mjml.toString(), { minify: min, validationLevel }).render())
    .then(result => stdout ? process.stdout.write(result) : write(output, result))
    .catch(e => {
      // XSD validation error ?
      if (e.getErrors) {
        return error(`${fileName ? `File: ${fileName} \n` : ``}${e.getMessages()}`)
      }

      return error(e)
    })
}

/*
 * Turns an MJML input file into a pretty HTML file
 * min: boolean that specify the output format (pretty/minified)
 */
export const renderFile = (input, options) => {
  const outputIsDirectory = !!options.output && isDirectory(options.output)

  const renderFiles = files => {
    files.forEach((file, index) => {
      const inFile = path.basename(file, '.mjml')
      const inputExtension = path.extname(inFile)
      let output

      if (options.output) {
        const outputExtension = path.extname(options.output) || '.html'
        const outFile = path.join(path.dirname(options.output), path.basename(options.output, outputExtension))
        const multipleFiles = files.length > 1

        if (multipleFiles && outputIsDirectory) {
          output = `${options.output}/${inFile}${outputExtension}`
        } else if (multipleFiles) {
          output = `${outFile}-${index + 1}${outputExtension}`
        } else {
          output = `${outFile}${outputExtension}`
        }
      } else {
        output = `${inFile}${inputExtension}`
      }

      const filePath = path.resolve(process.cwd(), file)

      render(read(filePath), { min: options.min, stdout: options.stdout, output, fileName: file, validationLevel: options.validationLevel })
    })
  }

  if (typeof input === 'string') {
    glob(input, (err, files) => renderFiles(files))
  } else {
    renderFiles(input)
  }
}

/**
 * Render based on input stream
 */
export const renderStream = options => render(readStdin(process.stdin), options)

/*
 * Watch changes on a specific input file by calling render on each change
 */
export const watch = (input, options) => {
  renderFile(input, options)
  fs.watchFile(input, () => console.log('Reloading MJML') || renderFile(input, options)) // eslint-disable-line no-console
}

/*
 * Create a new component based on the default template
 */
export const initComponent = (name, ending) => {
  mkdir(`./${name}`)
    .then(() => mkdir(`./${name}/src`))
    .then(() => write(`./${name}/src/index.js`, createComponent(upperFirst(camelCase(name)), ending)))
    .then(() => console.log(`Component created: ${name}`)) // eslint-disable-line no-console
}
