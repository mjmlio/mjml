import fs from 'fs'
import path from 'path'
import warning from 'warning'
import some from 'lodash/some'
import startsWith from 'lodash/startsWith'
import isEmpty from 'lodash/isEmpty'
import MJMLElementsCollection, { registerMJElement } from '../MJMLElementsCollection'

const cwd = process.cwd()

const isRelativePath = (name) => {
  return some(['./', '.', '../'], (matcher) => startsWith(name, matcher))
}

const checkIfConfigFileExist = () => {
  try {
    fs.statSync(`${cwd}/.mjmlconfig`)
    return true
  } catch (e) {
    warning(!isEmpty(MJMLElementsCollection), `No .mjmlconfig found in path ${cwd}, consider to add one`)
    return false
  }
}

const parseConfigFile = () => {
  if (!checkIfConfigFileExist()) {
    return false
  }

  try {
    return JSON.parse(fs.readFileSync(`${cwd}/.mjmlconfig`).toString())
  } catch (e) {
    warning(false, `.mjmlconfig has a ParseError: ${e}`)
  }
}

const parsePackages = (packages) => {
  if (!packages) {
    return;
  }

  packages.forEach(file => {
    if (!file) {
      return
    }

    try {
      const filename = path.join(process.cwd(), file)
      const Component = isRelativePath(file) ? require(filename) : require.main.require(file)

      registerMJElement(Component.default || Component)
    } catch (e) {
      warning(false, `.mjmlconfig file ${file} opened from ${cwd} has an error : ${e}`)
    }
  })
}

export default () => {
  const config = parseConfigFile()

  if (!config) {
    return;
  }

  parsePackages(config.packages)
}
