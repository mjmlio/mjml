export default ({ compiled: { html }, file }) =>
  new Promise(resolve => {
    // eslint-disable-next-line
    console.log(`<!-- FILE: ${file} -->\n${html}`)
    resolve()
  })
