import chokidar from 'chokidar'
import path from 'path'
import { flow, pickBy, zipObject, flatMap } from 'lodash/fp'

import readFile, { flatMapPaths } from './readFile'
import fileContext from '../helpers/fileContext'


export default (input, options) => {
  console.log(`Now watching: ${input}`) // eslint-disable-line no-console

  const dependencies = flow(
    flatMapPaths,
    paths => paths.map(p => path.resolve(p)),
    paths => zipObject(paths, paths.map(fileContext))
  )(input)

  const getRelatedFiles = file => (
    flow(
      pickBy((v, k) => (k === file || v.indexOf(file) !== -1)),
      Object.keys
    )(file)
  )

  const reloadDependenciesForPath = (file) => {
    dependencies[file] = fileContext(file)
  }

  const watcher = chokidar.watch([input, ...flatMap(dependencies)])

  watcher.on('add', (file) => {
    dependencies[file] = fileContext(file)

    console.log(`add ${file}`)
  })

  watcher.on('unlink', (path) => {
    console.log(`remove ${path}`)
    delete dependencies[path]

    getRelatedFiles(path).forEach(reloadDependenciesForPath)
  })

  watcher.on('change', (path) => {
    const now = new Date()

    console.log(`change on ${path}`)

    getRelatedFiles(path).forEach(reloadDependenciesForPath)

    // console.log(`[${timePad(now.getHours())}:${timePad(now.getMinutes())}:${timePad(now.getSeconds())}] Modification on ${path}, recompile ${mainFile} MJML`) // eslint-disable-line no-console
  })

  console.log(Object.keys(dependencies).map(readFile))

  return Object.keys(dependencies).map(readFile)
}
