import fs from 'fs'
import path from 'path'

export const isDirectory = (file) => {
  try {
    const outputPath = path.resolve(process.cwd(), file)

    return fs.statSync(outputPath).isDirectory()
  } catch (e) {
    return false
  }
}

const replaceExtension = input => input.replace(
  '.mjml',
  input.replace('.mjml', '').match(/(.)*\.(.)+$/g) ? '' : '.html'
)

const makeGuessOutputName = (outputPath) => {
  if (isDirectory(outputPath)) {
    return input => path.join(outputPath, replaceExtension(input))
  }

  return (input) => {
    if (!outputPath) {
      return replaceExtension(input)
    }

    return outputPath
  }
}

export default (outputPath) => {
  const guessOutputName = makeGuessOutputName(outputPath)

  return ({ file, mjml }) => (
    new Promise((resolve, reject) => {
      const outputName = guessOutputName(file)

      fs.writeFile(outputName, mjml, (err) => {
        if (err) {
          return reject()
        }

        return resolve()
      })
    })
  )
}
