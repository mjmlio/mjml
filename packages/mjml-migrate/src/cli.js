#!/usr/bin/env node

import fs from 'fs'
import yargs from 'yargs'
import migrate from './migrate'
import { version } from '../package.json'

const program = yargs
  .usage('$0 [options] <input-file> <output-file>')
  .version(version)
  .help()

if (program.argv._.length !== 2) {
  program.showHelp()
  process.exit(1)
}

const [inputFilename, outputFilename] = program.argv._

const input = fs.readFileSync(inputFilename, 'utf8')
const output = migrate(input)

fs.writeFileSync(outputFilename, output)

// eslint-disable-next-line no-console
console.log(
  `${inputFilename} was converted to the MJML 4 syntax in ${outputFilename}`,
)
