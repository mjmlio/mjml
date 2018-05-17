#!/bin/env node

import fs from 'fs'
import program from 'commander'
import migrate from './migrate'
import { version } from '../package.json'

program
  .version(version)
  .usage('[options] <input-file> <output-file>')
  .parse(process.argv)

if (program.args.length !== 2) {
  program.outputHelp()
  process.exit(1)
}

const [inputFilename, outputFilename] = program.args

const input = fs.readFileSync(inputFilename, 'utf8')
const output = migrate(input)

fs.writeFileSync(outputFilename, output)

// eslint-disable-next-line no-console
console.log(
  `${inputFilename} was converted to the MJML 4 syntax in ${outputFilename}`,
)
