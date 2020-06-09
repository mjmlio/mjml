export default ({ compiled: { html }, file }) =>
  new Promise((resolve) => {
    process.stdout.write(`<!-- FILE: ${file} -->\n${html}\n`, resolve)
  })
