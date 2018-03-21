import yargs from 'yargs'
import { html as htmlBeautify } from 'js-beautify'
import { flow, pick, isNil, negate, pickBy } from 'lodash/fp'
import { isArray, isEmpty, map } from 'lodash'

import mjml2html from 'mjml-core'
import migrate from 'mjml-migrate'

import readFile, { flatMapPaths } from './commands/readFile'
import watchFiles from './commands/watchFiles'
import readStream from './commands/readStream'
import outputToFile, { isDirectory } from './commands/outputToFile'
import outputToConsole from './commands/outputToConsole'

import { version as coreVersion } from 'mjml-core/package.json' // eslint-disable-line import/first
import { version as cliVersion } from '../package.json'
import { DEFAULT_OPTIONS } from './helpers/defaultOptions'

const beautifyOptions = {
  indent_size: 2,
  wrap_attributes_indent_size: 2,
  max_preserve_newline: 0,
  preserve_newlines: false,
}

export default async () => {
  let EXIT_CODE = 0
  let KEEP_OPEN = false

  const error = msg => {
    console.error(msg) // eslint-disable-line no-console

    return process.exit(1)
  }

  const pickArgs = args =>
    flow(
      pick(args),
      pickBy(e => negate(isNil)(e) && !(isArray(e) && isEmpty(e))),
    )

  const argv = yargs
    .options({
      r: {
        alias: 'read',
        describe: 'Compile MJML File(s)',
        type: 'array',
      },
      m: {
        alias: 'migrate',
        describe: 'Migrate MJML3 File(s)',
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
    .version(`mjml-core: ${coreVersion}\nmjml-cli: ${cliVersion}`).argv

  const config = Object.assign(DEFAULT_OPTIONS, argv.c)
  const inputArgs = pickArgs(['r', 'w', 'i', '_', 'm'])(argv)
  const outputArgs = pickArgs(['o', 's'])(argv)

  // implies (until yargs pr is accepted)
  ;[
    [Object.keys(inputArgs).length === 0, 'No input argument received'],
    [Object.keys(inputArgs).length > 1, 'Too many input arguments received'],
    [Object.keys(outputArgs).length > 1, 'Too many output arguments received'],
    [
      argv.w && argv.w.length > 1 && !argv.o,
      'Need an output option when watching files',
    ],
    [
      argv.w &&
        argv.w.length > 1 &&
        argv.o &&
        !isDirectory(argv.o) &&
        argv.o !== '',
      'Need an output option when watching files',
    ],
  ].forEach(v => (v[0] ? error(v[1]) : null))

  const inputOpt = Object.keys(inputArgs)[0]
  const outputOpt = Object.keys(outputArgs)[0] || 's'

  const inputFiles = isArray(inputArgs[inputOpt])
    ? inputArgs[inputOpt]
    : [inputArgs[inputOpt]]
  const inputs = []

  switch (inputOpt) {
    case 'r':
    case 'm':
    case '_': {
      flatMapPaths(inputFiles).forEach(file => {
        inputs.push(readFile(file))
      })
      break
    }
    case 'w':
      watchFiles(inputFiles, argv)
      KEEP_OPEN = true
      break
    case 'i':
      inputs.push(await readStream())
      break
    default:
      error('Cli error !')
  }

  const convertedStream = []
  const failedStream = []

  inputs.forEach(i => {
    // eslint-disable-line array-callback-return
    try {
      convertedStream.push(
        Object.assign({}, i, {
          compiled:
            inputOpt === 'm'
              ? { html: htmlBeautify(migrate(i.mjml), beautifyOptions) }
              : mjml2html(i.mjml, { ...config, filePath: i.file }),
        }),
      )
    } catch (e) {
      EXIT_CODE = 2

      failedStream.push({ file: i.file, error: e })
    }
  })

  convertedStream.forEach(s => {
    if (s.compiled && s.compiled.errors && s.compiled.errors.length) {
      console.log(map(s.compiled.errors, 'formattedMessage').join('\n'))
    }
  })

  failedStream.forEach(({ error, file }) => {
    // eslint-disable-line array-callback-return
    console.error(`${file ? `File: ${file}\n` : null}${error}`) // eslint-disable-line no-console

    if (config.stack) {
      console.error(error.stack) // eslint-disable-line no-console
    }
  })

  if (!KEEP_OPEN && convertedStream.length === 0) {
    error('Input file(s) failed to render')
  }

  switch (outputOpt) {
    case 'o':
      if (inputs.length > 1 && (!isDirectory(argv.o) && argv.o !== '')) {
        error(
          `Multiple input files, but output option should be either an existing directory or an empty string: ${argv.o} given`,
        )
      }

      Promise.all(convertedStream.map(outputToFile(argv.o)))
        .then(() => {
          if (!KEEP_OPEN) {
            process.exit(EXIT_CODE)
          }
        })
        .catch(() => {
          if (!KEEP_OPEN) {
            process.exit(1)
          }
        })
      break
    case 's':
      Promise.all(convertedStream.map(outputToConsole))
        .then(() => process.exit(EXIT_CODE))
        .catch(() => process.exit(1))
      break
    default:
      error('Cli error ! (No output option available)')
  }
}
