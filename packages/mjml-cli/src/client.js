import { MJMLRenderer, version, documentParser, MJMLValidator } from 'mjml-core'
import fs from 'fs'
import glob from 'glob'
import path from 'path'

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
const read      = promisify(fs.readFile)
const readStdin = promisify(stdinToBuffer)

/*
 * Render an input promise
 */
const render = (bufferPromise, { min, output, stdout, fileName, level }) => {
  bufferPromise
    .then(mjml => new MJMLRenderer(mjml.toString(), { minify: min, level }).render())
    .then(result => {
      const { html: content, errors } = result

      if (errors) {
        error(errors.map(err => err.formattedMessage).join('\n'))
      }

      stdout ? process.stdout.write(content) : write(output, content)
    })
    .catch(e => {
      if (e.getMessages) {
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
        output = `${inFile}${path.extname(inFile) || ".html"}`
      }

      const filePath = path.resolve(process.cwd(), file)

      render(read(filePath), { min: options.min, stdout: options.stdout, output, fileName: file, level: options.level })
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

const availableOutputFormat = {
  json: JSON.stringify,
  text: (errs) => errs.map(e => e.formattedMessage).join('\n')
}

/**
 * Validate an MJML document
 */
export const validate = (input, { format }) => {
  read(input)
    .then(content => {
      const MJMLDocument = documentParser(content.toString())
      const report = MJMLValidator(MJMLDocument)

      const outputFormat = availableOutputFormat[format] || availableOutputFormat['text']

      process.stdout.write(outputFormat(report))
    })
    .catch(e => {
      return error(`Error: ${e}`)
    })
}

/*
 * Watch changes on a specific input file by calling render on each change
 */
export const watch = (input, options) => {
  renderFile(input, options)
  fs.watchFile(input, () => {
    const now = new Date()

    console.log(`[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] Reloading MJML`) || renderFile(input, options) // eslint-disable-line no-console
  })
}
