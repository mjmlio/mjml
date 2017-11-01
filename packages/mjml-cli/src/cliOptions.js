import yargs from 'yargs'
import { version as coreVersion } from 'mjml-core/package.json' // eslint-disable-line import/first
import { version as cliVersion } from '../package.json'

const cliOptions = yargs
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

export default cliOptions
