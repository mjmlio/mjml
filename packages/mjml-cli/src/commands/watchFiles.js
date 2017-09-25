import chokidar from 'chokidar'
import glob from 'glob'
import path from 'path'
import mjml2html from 'mjml-core'
import { flow, pickBy, zipObject, flatMap, uniq, difference } from 'lodash/fp'

import readFile from './readFile'
import outputToFile from './outputToFile'
import fileContext from '../helpers/fileContext'

let dirty = []

const _flatMap = flatMap.convert({ cap: false }) // eslint-disable-line no-underscore-dangle
const flatMapAndJoin = _flatMap((v, k) => v.map(p => path.join(k, p)))
const flatMapKeyAndValues = flow(
  _flatMap((v, k) => [k, ...v]),
  uniq,
)

export default (input, options) => {
  console.log(`Now watching: ${input}`) // eslint-disable-line no-console

  const dependencies = {}
  const getRelatedFiles = file => (
    flow(
      pickBy((v, k) => (k === file || v.indexOf(file) !== -1)),
      Object.keys
    )(dependencies)
  )
  const synchronyzeWatcher = (filePath) => {
    getRelatedFiles(
      filePath
    ).forEach((f) => {
      dependencies[f] = fileContext(f)

      if (dirty.indexOf(f) === -1) {
        dirty.push(f)
      }
    })

    const files = {
      toWatch: flatMapKeyAndValues(dependencies),
      watched: flatMapAndJoin(watcher.getWatched()),
    }

    watcher.add(difference(files.toWatch, files.watched))
    watcher.unwatch(difference(files.watched, files.toWatch))
  }
  const readAndCompile = flow(
    file => ({ file, content: readFile(file) }),
    args => ({ ...args, compiled: mjml2html(args.content, options.config) }),
    outputToFile(options.o)
  )

  console.log('???')

  const watcher = chokidar
    .watch(input)
    .on('add', (file) => {
      const filePath = path.resolve(file)
      const matchInputOption = input.reduce(
        (found, file) => found || glob(path.resolve(file)).minimatch.match(filePath),
        false
      )

      if (matchInputOption) {
        console.log('match watch options', filePath)
        dependencies[filePath] = getRelatedFiles(filePath)
      }

      synchronyzeWatcher(filePath)

      console.log(`added ${filePath}`)
    })
    .on('unlink', (file) => {
      const filePath = path.resolve(file)

      delete dependencies[path.resolve(filePath)]

      synchronyzeWatcher(filePath)
    })
    .on('change', (file) => {
      const filePath = path.resolve(file)

      console.log(`change on ${filePath}`)

      synchronyzeWatcher(filePath)
    })

  setInterval(
    () => {
      console.log('dirty:', dirty)
      dirty.forEach(f => (
        readAndCompile(f)
          .then(htmlFile => console.log(`${f} - Successfully write ${htmlFile}`))
          .catch(htmlFile => console.log(`${f} - Error while compiling file ${htmlFile}`))
      ))
      dirty = []
    },
    500
  )

  return []
}
