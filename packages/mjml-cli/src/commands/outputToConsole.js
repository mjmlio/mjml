export default ({ mjml, file }) => (
  new Promise((resolve) => {
    console.log(`<!-- FILE: ${file} -->\n${mjml}`)
    resolve()
  })
)
