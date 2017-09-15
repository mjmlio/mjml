import chokidar from 'chokidar'
import path from 'path'
import { flow, pickBy, zipObject, flatMap, uniq, difference } from 'lodash/fp'

import readFile, { flatMapPaths } from './readFile'
import fileContext from '../helpers/fileContext'

const _flatMap = flatMap.convert({ cap: false }) // eslint-disable-line no-underscore-dangle

const flatMapKeyAndValues = flow(
  _flatMap((v, k) => [k, ...v]),
  uniq,
)

const flatMapAndJoin = _flatMap((v, k) => v.map(p => path.join(k, p)))

export default (input, options) => {
  console.log(`Now watching: ${input}`) // eslint-disable-line no-console

  const dependencies = {}

  const getRelatedFiles = file => (
    flow(
      pickBy((v, k) => (k === file || v.indexOf(file) !== -1)),
      Object.keys
    )(dependencies)
  )

  const reloadDependenciesForPath = (file) => {
    dependencies[file] = fileContext(file)
  }

  const watcher = chokidar
    .watch([input, ...flatMap(dependencies)])
    .on('add', (file) => {
      dependencies[path.resolve(file)] = fileContext(file)

      console.log(`add ${file}`)
    })
    .on('unlink', (file) => {
      const filePath = path.resolve(file)

      delete dependencies[path.resolve(filePath)]

      getRelatedFiles(path.resolve(filePath)).forEach(reloadDependenciesForPath)
    })
    .on('change', (file) => {
      const filePath = path.resolve(file)
      const relatedFiles = getRelatedFiles(filePath)

      console.log(`change on ${filePath}`)

      relatedFiles.forEach((f) => {
        reloadDependenciesForPath(f)
      })

      const files = {
        toWatch: flatMapKeyAndValues(dependencies),
        watched: flatMapAndJoin(watcher.getWatched()
      }

      watcher.add(difference(files.toWatch, files.watched))
      watcher.remove(difference(files.watched, files.toWatch))

      console.log(dependencies)
      console.log('total file:', flatMapKeyAndValues(dependencies))
      console.log('watched file:', flatMapAndJoin(watcher.getWatched()))
      // removed
      console.log('differnece total <-> watched: ', difference(flatMapAndJoin(watcher.getWatched()), flatMapKeyAndValues(dependencies)))
      // add
      console.log('differnece watched <-> total: ', difference(flatMapKeyAndValues(dependencies), flatMapAndJoin(watcher.getWatched())))


      // add-remove non-needed files
      // getWatched <> dependencies flattened

      // console.log(`[${timePad(now.getHours())}:${timePad(now.getMinutes())}:${timePad(now.getSeconds())}] Modification on ${path}, recompile ${mainFile} MJML`) // eslint-disable-line no-console
    })

  return Object
    .keys(
      flow(
        flatMapPaths,
        paths => paths.map(p => path.resolve(p)),
        paths => zipObject(paths, paths.map(fileContext))
      )(input)
    )
    .map(readFile)
}
