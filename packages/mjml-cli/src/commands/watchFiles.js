/* eslint-disable no-console */
import chokidar from 'chokidar'
import glob from 'glob'
import path from 'path'
import mjml2html from 'mjml-core'
import { flow, pickBy, flatMap, uniq, difference, remove } from 'lodash/fp'

import readFile from './readFile'
import makeOutputToFile from './outputToFile'
import fileContext from '../helpers/fileContext'

let dirty = []

const _flatMap = flatMap.convert({ cap: false }) // eslint-disable-line no-underscore-dangle
const flatMapAndJoin = _flatMap((v, k) => v.map((p) => path.join(k, p)))
const flatMapKeyAndValues = flow(
  _flatMap((v, k) => [k, ...v]),
  uniq,
)

export default (input, options) => {
  console.log(`Now watching: ${input}`)

  const dependencies = {}
  const outputToFile = makeOutputToFile(options.o)
  const getRelatedFiles = (file) =>
    flow(
      pickBy((v, k) => k === file || v.indexOf(file) !== -1),
      Object.keys,
    )(dependencies)
  const synchronyzeWatcher = (filePath) => {
    getRelatedFiles(filePath).forEach((f) => {
      dependencies[f] = fileContext(f, options.config.filePath)

      if (dirty.indexOf(f) === -1) {
        dirty.push(f)
      }
    })

    /* eslint-disable no-use-before-define */
    const files = {
      toWatch: flatMapKeyAndValues(dependencies),
      watched: flatMapAndJoin(watcher.getWatched()),
    }

    watcher.add(difference(files.toWatch, files.watched))
    watcher.unwatch(difference(files.watched, files.toWatch))
    /* eslint-enable no-use-before-define */
  }
  const readAndCompile = flow(
    (file) => ({ file, content: readFile(file).mjml }),
    (args) => ({
      ...args,
      compiled: mjml2html(args.content, {
        filePath: args.file,
        actualPath: args.file,
        ...options.config,
      }),
    }),
    (args) => {
      const {
        compiled: { errors },
      } = args

      errors.forEach((e) => console.warn(e.formattedMessage))

      return args
    },
    (args) =>
      outputToFile(args)
        .then(() => console.log(`${args.file} - Successfully compiled`))
        .catch(() => console.log(`${args.file} - Error while compiling file`)),
  )

  const watcher = chokidar
    .watch(input.map((i) => i.replace(/\\/g, '/')))
    .on('change', (file) => synchronyzeWatcher(path.resolve(file)))
    .on('add', (file) => {
      const filePath = path.resolve(file)

      const matchInputOption = input.reduce(
        (found, file) =>
          found || glob(path.resolve(file)).minimatch.match(filePath),
        false,
      )

      if (matchInputOption) {
        dependencies[filePath] = getRelatedFiles(filePath)
      }

      synchronyzeWatcher(filePath)
    })
    .on('unlink', (file) => {
      const filePath = path.resolve(file)

      delete dependencies[path.resolve(filePath)]

      remove(dirty, (f) => f === filePath)

      synchronyzeWatcher(filePath)
    })

  setInterval(() => {
    dirty.forEach((f) => {
      console.log(`${f} - Change detected`)
      try {
        readAndCompile(f)
      } catch (e) {
        console.log(`${f} - Error while rendering the file : `, e)
      }
    })
    dirty = []
  }, 500)

  return []
}
/* eslint-enable no-console */
