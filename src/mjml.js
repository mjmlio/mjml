#!/usr/bin/env node

import { version, watch, render, initComponent } from './cli'
import binary from 'commander'

/*
 * Parse the command line arguments
 */
binary
  .version(version)

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
  case (!!binary.watch) :
    watch(binary.watch, binary)
    break
  case (!!binary.render) :
    render(binary.render, binary)
    break
  case (!!binary.register) :
    console.error('--register option is deprecated, please now use --init-component')
    process.exit(1)
    break
  case (!!binary.initComponent) :
    initComponent(binary.initComponent, binary.ending, false)
    break
  default :
    console.log(version)
}
