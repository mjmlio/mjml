#!/usr/bin/env node

import binary                  from 'commander'
import mjmlEngine              from './index'
import mjmlCLI                 from './cli'

/*
 * If require.main
 */
const main = () => {
  /*
   * Parse the command line arguments
   */
  binary
    .version(mjmlCLI.version())

  binary
    .option('-r, --render <file>', 'Compiles an MJML file')
    .option('-w, --watch <file>', 'Watch and render an MJML file')
    .option('-o, --output <file>', 'Redirect the HTML to a file', 'a.html')
    .option('-m, --min', 'Minify the final output file', 'false')
    .option('-e, --ending', 'Specifies that the newly created component is an ending tag')
    .option('--register <name>', 'Initialize a self-registering MJML component (deprecated)')
    .option('--init-component <name>', 'Initialize an MJML component')

  binary.parse(process.argv)

  switch (true) {
    case (!!binary.watch)     : return mjmlCLI.watch(binary.watch, binary)
    case (!!binary.render)    : return mjmlCLI.render(binary.render, binary)
    case (!!binary.register)  : console.error("--register option is deprecated, please now use --init-component"); return process.exit(1)
    case (!!binary.initComponent)  : return mjmlCLI.initComponent(binary.initComponent, binary.ending, false)
    default                   : return console.log(mjmlCLI.version())
  }
}

/*
 * Importing this library in your project will
 * give you the MJML engine
 */
module.exports = mjmlEngine

if (require.main === module) {
  main()
}
