import chokidar from 'chokidar'
import path from 'path'
import { flow, pickBy, zipObject, flatMap } from 'lodash/fp'

import readFile, { flatMapPaths } from './readFile'
import fileContext from '../helpers/fileContext'


export default (input, options) => {
  console.log(`Now watching: ${input}`) // eslint-disable-line no-console

  const dependencies = {}

  const getRelatedFiles = file => (
    flow(
      pickBy((v, k) => (k === file || v.indexOf(file) !== -1)),
      Object.keys
    )(file)
  )

  const reloadDependenciesForPath = (file) => {
    dependencies[file] = fileContext(file)
  }

  chokidar
    .watch([input, ...flatMap(dependencies)])
    .on('add', (file) => {
      dependencies[path.resolve(file)] = fileContext(file)

      console.log(`add ${file}`)
    })
    .on('unlink', (file) => {
      const filePath = path.resolve(file)
      console.log(`remove ${filePath}`)
      delete dependencies[path.resolve(filePath)]

      getRelatedFiles(path.resolve(filePath)).forEach(reloadDependenciesForPath)
    })
    .on('change', (file) => {
      const filePath = path.resolve(file)
      const now = new Date()

      console.log(`change on ${filePath}`)

      getRelatedFiles(filePath).forEach(reloadDependenciesForPath)

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
