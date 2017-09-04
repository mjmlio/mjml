export default ({ html, file }) => (
  new Promise((resolve) => {
    console.log(`<!-- FILE: ${file} -->\n${html}`)
    resolve()
  })
)
