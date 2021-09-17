import path from 'path'
import yargs from 'yargs'
import { flow, pick, isNil, negate, pickBy } from 'lodash/fp'
import { isArray, isEmpty, map, get, omit } from 'lodash'
import { html as htmlBeautify } from 'js-beautify'
import { minify as htmlMinify } from 'html-minifier'

import mjml2html, { components, initializeType } from 'mjml-core'
import migrate from 'mjml-migrate'
import validate, { dependencies } from 'mjml-validator'
import MJMLParser from 'mjml-parser-xml'

import { version as coreVersion } from 'mjml-core/package.json'
import readFile, { flatMapPaths } from './commands/readFile'
import watchFiles from './commands/watchFiles'
import readStream from './commands/readStream'
import outputToFile, { isDirectory } from './commands/outputToFile'
import outputToConsole from './commands/outputToConsole'

import { version as cliVersion } from '../package.json'
import DEFAULT_OPTIONS from './helpers/defaultOptions'

const beautifyConfig = {
  indent_size: 2,
  wrap_attributes_indent_size: 2,
  max_preserve_newline: 0,
  preserve_newlines: false,
  end_with_newline: true,
}

const minifyConfig = {
  collapseWhitespace: true,
  minifyCSS: false,
  caseSensitive: true,
  removeEmptyAttributes: true,
}

export default async () => {
  let EXIT_CODE = 0
  let KEEP_OPEN = false

  const error = (msg) => {
    console.error('\nCommand line error:') // eslint-disable-line no-console
    console.error(msg) // eslint-disable-line no-console

    process.exit(1)
  }

  const pickArgs = (args) =>
    flow(
      pick(args),
      pickBy((e) => negate(isNil)(e) && !(isArray(e) && isEmpty(e))),
    )

  const { argv } = yargs
    .version(false) // cf. https://github.com/yargs/yargs/issues/961
    .options({
      r: {
        alias: 'read',
        describe: 'Compile MJML File(s)',
        type: 'array',
      },
      m: {
        alias: 'migrate',
        describe: 'Migrate MJML3 File(s) (deprecated)',
        type: 'array',
      },
      v: {
        alias: 'validate',
        describe: 'Run validator on File(s)',
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
      noStdoutFileComment: {
        type: 'boolean',
        describe: 'Add no file comment to stdout',
      },
    })
    .help()
    .version(`mjml-core: ${coreVersion}\nmjml-cli: ${cliVersion}`)

  let juiceOptions
  let minifyOptions
  let juicePreserveTags
  let fonts

  try {
    juiceOptions =
      argv.c && argv.c.juiceOptions && JSON.parse(argv.c.juiceOptions)
  } catch (e) {
    error(`Failed to decode JSON for config.juiceOptions argument`)
  }

  try {
    minifyOptions =
      argv.c && argv.c.minifyOptions && JSON.parse(argv.c.minifyOptions)
  } catch (e) {
    error(`Failed to decode JSON for config.minifyOptions argument`)
  }

  try {
    juicePreserveTags =
      argv.c && argv.c.juicePreserveTags && JSON.parse(argv.c.juicePreserveTags)
  } catch (e) {
    error(`Failed to decode JSON for config.juicePreserveTags argument`)
  }

  try {
    fonts = argv.c && argv.c.fonts && JSON.parse(argv.c.fonts)
  } catch (e) {
    error(`Failed to decode JSON for config.fonts argument`)
  }

  const filePath = argv.c && argv.c.filePath

  const config = Object.assign(
    DEFAULT_OPTIONS,
    argv.c,
    fonts && { fonts },
    minifyOptions && { minifyOptions },
    juiceOptions && { juiceOptions },
    juicePreserveTags && { juicePreserveTags },
    argv.c && argv.c.keepComments === 'false' && { keepComments: false },
  )

  const inputArgs = pickArgs(['r', 'w', 'i', '_', 'm', 'v'])(argv)
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
  ].forEach((v) => (v[0] ? error(v[1]) : null))

  const inputOpt = Object.keys(inputArgs)[0]
  const outputOpt = Object.keys(outputArgs)[0] || 's'

  const inputFiles = isArray(inputArgs[inputOpt])
    ? inputArgs[inputOpt]
    : [inputArgs[inputOpt]]
  const inputs = []

  switch (inputOpt) {
    case 'r':
    case 'v':
    case 'm':
    case '_': {
      flatMapPaths(inputFiles).forEach((file) => {
        inputs.push(readFile(file))
      })

      if (!inputs.length) {
        error('No input files found')
        return
      }
      break
    }
    case 'w':
      watchFiles(inputFiles, {
        ...argv,
        config,
        minifyConfig,
        beautifyConfig,
      })
      KEEP_OPEN = true
      break
    case 'i':
      inputs.push(await readStream())
      break
    default:
      error('Command line error: Incorrect input options')
  }

  const convertedStream = []
  const failedStream = []

  inputs.forEach((i) => {
    try {
      let compiled
      switch (inputOpt) {
        case 'm':
          compiled = { html: migrate(i.mjml, { beautify: true }) }
          break
        case 'v': // eslint-disable-next-line no-case-declarations
          const mjmlJson = MJMLParser(i.mjml, {
            components,
            filePath: filePath || i.file,
            actualPath: i.file,
          })
          compiled = {
            errors: validate(mjmlJson, {
              dependencies,
              components,
              initializeType,
            }),
          }
          break

        default: {
          const beautify = config.beautify && config.beautify !== 'false'
          const minify = config.minify && config.minify !== 'false'

          compiled = mjml2html(i.mjml, {
            ...omit(config, ['minify', 'beautify']),
            filePath: filePath || i.file,
            actualPath: i.file,
          })
          if (beautify) {
            compiled.html = htmlBeautify(compiled.html, beautifyConfig)
          }
          if (minify) {
            compiled.html = htmlMinify(compiled.html, {
              ...minifyConfig,
              ...config.minifyOptions,
            })
          }
        }
      }

      convertedStream.push({ ...i, compiled })
    } catch (e) {
      EXIT_CODE = 2
      failedStream.push({ file: i.file, error: e })
    }
  })

  convertedStream.forEach((s) => {
    if (get(s, 'compiled.errors.length')) {
      console.error(map(s.compiled.errors, 'formattedMessage').join('\n')) // eslint-disable-line no-console
    }
  })

  failedStream.forEach(({ error, file }) => {
    console.error(`${file ? `File: ${file}\n` : null}${error}`) // eslint-disable-line no-console

    if (config.stack) {
      console.error(error.stack) // eslint-disable-line no-console
    }
  })

  if (inputOpt === 'v') {
    const isInvalid =
      failedStream.length ||
      convertedStream.some((s) => !!get(s, 'compiled.errors.length'))

    if (isInvalid) {
      error('Validation failed')
      return
    }
    process.exitCode = 0
    return
  }

  if (!KEEP_OPEN && convertedStream.length === 0) {
    error('Input file(s) failed to render')
  }

  switch (outputOpt) {
    case 'o': {
      if (inputs.length > 1 && !isDirectory(argv.o) && argv.o !== '') {
        error(
          `Multiple input files, but output option should be either an existing directory or an empty string: ${argv.o} given`,
        )
      }

      const fullOutputPath = path.parse(path.resolve(process.cwd(), argv.o))

      if (inputs.length === 1 && !isDirectory(fullOutputPath.dir)) {
        error(`Output directory doesn’t exist for path : ${argv.o}`)
      }

      Promise.all(convertedStream.map(outputToFile(argv.o)))
        .then(() => {
          if (!KEEP_OPEN) {
            process.exitCode = EXIT_CODE
          }
        })
        .catch(({ outputName, err }) => {
          if (!KEEP_OPEN) {
            error(`Error writing file - ${outputName} : ${err}`)
          }
        })
      break
    }
    case 's': {
      const addFileHeaderComment = !argv.noStdoutFileComment
      Promise.all(convertedStream.map(converted => outputToConsole(converted, addFileHeaderComment)))
        .then(() => (process.exitCode = EXIT_CODE)) // eslint-disable-line no-return-assign
        .catch(() => (process.exitCode = 1)) // eslint-disable-line no-return-assign
      break
    }
    default:
      error('Command line error: No output option available')
  }
}
