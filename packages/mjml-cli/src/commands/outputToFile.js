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

const replaceExtension = (input) =>
  input.replace(
    '.mjml',
    input.replace('.mjml', '').match(/(.)*\.(.)+$/g) ? '' : '.html',
  )

const stripPath = (input) => input.match(/[^/\\]+$/g)[0]

const makeGuessOutputName = (outputPath) => {
  if (isDirectory(outputPath)) {
    return (input) => path.join(outputPath, replaceExtension(stripPath(input)))
  }

  return (input) => {
    if (!outputPath) {
      return replaceExtension(stripPath(input))
    }

    return outputPath
  }
}

export default (outputPath) => {
  const guessOutputName = makeGuessOutputName(outputPath)

  return ({ file, compiled: { html } }) =>
    new Promise((resolve, reject) => {
      const outputName = guessOutputName(file)

      fs.writeFile(outputName, html, (err) => {
        if (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject({ outputName, err })
        }

        return resolve(outputName)
      })
    })
}
