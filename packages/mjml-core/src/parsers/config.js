import fs from 'fs'
import path from 'path'
import warning from 'warning'
import some from 'lodash/some'
import startsWith from 'lodash/startsWith'
import isEmpty from 'lodash/isEmpty'
import MJMLElementsCollection, { registerMJElement } from './MJMLElementsCollection'

const cwd = process.cwd()

const isFile = (name) => {
  return some(['./', '.', '../'], (matcher) => startsWith(name, matcher))
}

const checkIfConfigFileExist = () => {
  try {
    fs.statSync(`${cwd}/.mjmlconfig`)
  } catch (e) {
    return warning(!isEmpty(MJMLElementsCollection), `No .mjmlconfig found in path ${cwd}, consider to add one`)
  }
}

const parseConfigFile = () => {
  checkIfConfigFileExist()

  try {
    return JSON.parse(fs.readFileSync(`${cwd}/.mjmlconfig`).toString())
  } catch (e) {
    warning(false, `.mjmlconfig has a ParseError: ${e}`)
  }
}

const parsePackages = (packages) => {
  packages.forEach(file => {
    if (!file) {
      return
    }

    try {
      const filename = path.join(process.cwd(), file)
      const Component = isFile(file) ? require(filename) : require.main.require(file)

      registerMJElement(Component.default || Component)
    } catch (e) {
      warning(false, `.mjmlconfig file ${file} opened from ${cwd} has an error : ${e}`)
    }
  })
}

export default () => {
  const config = parseConfigFile()

  parsePackages(config.packages)
}
