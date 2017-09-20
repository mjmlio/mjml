import yargs from 'yargs'

import { flow, pick, isNil, negate, pickBy } from 'lodash/fp'
import { isArray, isEmpty } from 'lodash'
import mjml2html from 'mjml-core'

import readFile, { flatMapPaths } from './commands/readFile'
import watchFiles from './commands/watchFiles'
import readStream from './commands/readStream'
import outputToFile, { isDirectory } from './commands/outputToFile'
import outputToConsole from './commands/outputToConsole'

import { version as coreVersion } from 'mjml-core/package.json' // eslint-disable-line import/first
import { version as cliVersion } from '../package.json'

const DEFAULT_OPTIONS = {
  beautify: true,
  minify: false,
}
let EXIT_CODE = 0
let KEEP_OPEN = false

const error = (msg) => {
  console.error(msg) // eslint-disable-line no-console

  return process.exit(1)
}

const pickArgs = args => (
  flow(
    pick(args),
    pickBy(e => negate(isNil)(e) && !(isArray(e) && isEmpty(e)))
  )
)

const argv = yargs
  .options({
    r: {
      alias: 'read',
      describe: 'Compile MJML File(s)',
      type: 'array',
    },
    w: {
      alias: 'watch',
      type: 'array',
      describe: 'Watch and compile MJML File(s) when modified',
    },
    i: {
      alias: 'stdin',
      describe: 'Compiles MJML from input stream',
    },
    s: {
      alias: 'stdout',
      describe: 'Output HTML to stdout',
    },
    o: {
      alias: 'output',
      type: 'string',
      describe: 'Filename/Directory to output compiled files',
    },
    c: {
      alias: 'config',
      type: 'object',
      describe: 'Option to pass to mjml-core',
    },
    version: {
      alias: 'V',
    },
  })
  .help()
  .version(`mjml-core: ${coreVersion}\nmjml-cli: ${cliVersion}`)
  .argv

const config = Object.assign(DEFAULT_OPTIONS, argv.c)
const inputArgs = pickArgs(['r', 'w', 'i', '_'])(argv)
const outputArgs = pickArgs(['o', 's'])(argv)

if (Object.keys(inputArgs).length > 1) { error('Too much input arguments received') }
if (Object.keys(inputArgs).length === 0) { error('No input arguments received') }
if (Object.keys(outputArgs).length > 1) { error('Too much output arguments received') }

const inputOpt = Object.keys(inputArgs)[0]
const outputOpt = Object.keys(outputArgs)[0] || 's'

const inputFiles = isArray(inputArgs[inputOpt]) ? inputArgs[inputOpt] : [inputArgs[inputOpt]]
const inputs = []

switch (inputOpt) {
  case 'r':
  case '_': {
    flatMapPaths(inputFiles).forEach((file) => {
      inputs.push(readFile(file))
    })
    break
  }
  case 'w':
    if (!isDirectory(argv.o) && argv.o !== '') {
      error(`Watching files, but output option should be either a directory or an empty string: ${argv.o} given ${isDirectory(argv.o)}`)
    }

    watchFiles(inputFiles, argv)
      .forEach(f => inputs.push(f))
    KEEP_OPEN = true
    break
  case 'i':
    inputs.push(readStream())
    break
  default:
    error('Cli error !')
}

const convertedStream = []
const failedStream = []

inputs.forEach((i) => { // eslint-disable-line array-callback-return
  try {
    convertedStream.push(
      Object.assign(
        {},
        i,
        { compiled: mjml2html(i.mjml, { ...config, filePath: i.file }) }
      )
    )
  } catch (e) {
    EXIT_CODE = 2

    failedStream.push({ file: i.file, error: e })
  }
})

failedStream.forEach(({ error, file }) => { // eslint-disable-line array-callback-return
  console.error(`${file ? `File: ${file}\n` : null}${error}`) // eslint-disable-line no-console

  if (config.stack) { console.error(error.stack) } // eslint-disable-line no-console
})

if (convertedStream.length === 0) {
  error('Input file(s) failed to render')
}

switch (outputOpt) {
  case 'o':
    if (inputs.length > 1 && (!isDirectory(argv.o) && argv.o !== '')) {
      error(`Multiple input files, but output option should be either a directory or an empty string: ${argv.o} given`)
    }

    Promise
      .all(convertedStream.map(outputToFile(argv.o)))
      .then(() => {
        if (!KEEP_OPEN) { process.exit(EXIT_CODE) }
      })
      .catch(() => {
        if (!KEEP_OPEN) { process.exit(1) }
      })
    break
  case 's':
    Promise
      .all(convertedStream.map(outputToConsole))
      .then(() => process.exit(EXIT_CODE))
      .catch(() => process.exit(1))
    break
  default:
    error('Cli error ! (No output option available)')
}
