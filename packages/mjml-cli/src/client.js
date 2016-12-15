import { mjml2html, version, documentParser, MJMLValidator } from 'mjml-core'
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
const availableErrorOutputFormat = {
  json: JSON.stringify,
  text: (errs) => errs.map(e => e.formattedMessage).join('\n')
}

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
  const handleError = (message) => fileName ? error(`File: ${fileName} \n${message}`) : error(message)

  return bufferPromise
    .then(mjml => mjml2html(mjml.toString(), { minify: min, level }))
    .then(result => {
      const { html, errors } = result

      // non-blocking errors
      if (errors.length > 0) {
        handleError(availableErrorOutputFormat['text'](errors))
      }

      stdout ? process.stdout.write(html) : write(output, html)
    })
    .catch(e => {
      error(e.getMessages ? e.getMessages() : e)
      throw e
    })
}

const outputFileName = (input, output) => {
  const outputIsDirectory = isDirectory(output)
  const { ext, name } = path.parse((!output || outputIsDirectory) ? input : output)

  return path.format({
    dir: outputIsDirectory ? output : '.',
    name: name.replace('.mjml', ''),
    ext: ext == ".mjml" ? '.html' : ext
  })
}

/*
 * Turns an MJML input file into a pretty HTML file
 * min: boolean that specify the output format (pretty/minified)
 */
export const renderFiles = (input, options) => {
  return new Promise((resolve, reject) => {
    glob(input, (err, files) => {
      const processedFiles = []

      files.forEach(f => {
        processedFiles.push(renderFile(f, options))
      })

      Promise.all(processedFiles).then(resolve).catch(reject)
    })
  })
}

export const renderFile = (file, { output, level, min, stdout }) => {
  return render(read(path.resolve(process.cwd(), file)), {
    output: outputFileName(file, output),
    fileName: file,
    level,
    min,
    stdout
  })
}

/**
 * Render based on input stream
 */
export const renderStream = options => {
  return render(readStdin(process.stdin), options)
}

/**
 * Validate an MJML document
 */
export const validate = (input, { format }) => {
  return read(input)
    .then(content => {
      const MJMLDocument = documentParser(content.toString())
      const report = MJMLValidator(MJMLDocument)
      const outputFormat = availableErrorOutputFormat[format] || availableErrorOutputFormat['text']

      error(outputFormat(report))
    })
    .catch(e => {
      error(`Error: ${e}`)
      throw e
    })
}

/*
 * Watch changes on a specific input file by calling render on each change
 */
export const watch = (input, options) => {
  renderFile(input, options)

  fs.watchFile(input, () => {
    const now = new Date()

    console.log(`[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] Reloading MJML`) // eslint-disable-line no-console
    renderFile(input, options)
  })
}
