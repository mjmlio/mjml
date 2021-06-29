export default ({ compiled: { html }, file }, addFileHeaderComment) =>
  new Promise((resolve) => {
    let output = ''
    if(addFileHeaderComment) {
      output = `<!-- FILE: ${file} -->\n`
    }
    output += `${html}\n`

    process.stdout.write(output, resolve)
  })
