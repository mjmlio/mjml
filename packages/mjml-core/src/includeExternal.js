import fs from 'fs'

const includes = /<mj-include\s+path=['"](.*\.mjml)['"]\s*(\/>|>\s*<\/mj-include>)/g

const getContent = input =>
  input
    .replace(/<mjml>[\n\s\t]+<mj-body>[\n\s\t]+<mj-container>/, '')
    .replace(/<\/mj-container>[\n\s\t]+<\/mj-body>[\n\s\t]+<\/mjml>/, '')

export default mjml => mjml.replace(includes, (_, path) => {
  const mjmlExtension = file => file.trim().match(/.mjml$/) && file || `${file}.mjml`

  const template = fs.readFileSync(mjmlExtension(path), 'utf8')
  const content = getContent(template)

  if (!content) { throw new Error(`Error while parsing file: ${path}`) }

  return content
})
