export default ({ compiled: { html }, file }) => (
  new Promise((resolve) => {
    console.log(`<!-- FILE: ${file} -->\n${html}`)
    resolve()
  })
)
