const isArray = require('lodash/isArray')
const isObject = require('lodash/isObject')
const forOwn = require('lodash/forOwn')
const omit = require('lodash/omit')
const transform = require('lodash/transform')
const isEqual = require('lodash/isEqual')

function omitDeepLodash(input, props) {
  function omitDeepOnOwnProps(obj) {
    if (!isArray(obj) && !isObject(obj)) {
      return obj
    }

    if (isArray(obj)) {
      return omitDeepLodash(obj, props)
    }

    const o = {}
    forOwn(obj, (value, key) => {
      o[key] = omitDeepLodash(value, props)
    })

    return omit(o, props)
  }

  if (typeof input === 'undefined') {
    return undefined
  }

  if (isArray(input)) {
    return input.map(omitDeepOnOwnProps)
  }

  return omitDeepOnOwnProps(input)
}

function deepDiff(object, base) {
  function changes(object, base) {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value
      }
    })
  }
  return changes(object, base)
}

function displayDiff(obj1, obj2) {
  const diffs = deepDiff(obj1, obj2)
  if (isEqual(diffs, {})) {
    console.log('\x1b[32m', 'Parsing test successful') // eslint-disable-line no-console
    console.log('\x1b[0m', '') // eslint-disable-line no-console
  } else {
    console.log('\x1b[31m', 'Parsing test failed. Differences found :') // eslint-disable-line no-console
    console.log('\x1b[0m', JSON.stringify(diffs, null, 2)) // eslint-disable-line no-console
  }
}

module.exports = {
  omitDeepLodash,
  displayDiff,
}
