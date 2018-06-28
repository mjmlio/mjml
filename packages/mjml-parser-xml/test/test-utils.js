const _ = require('lodash')

function omitDeepLodash(input, props) {
  function omitDeepOnOwnProps(obj) {
    if (!_.isArray(obj) && !_.isObject(obj)) {
      return obj
    }

    if (_.isArray(obj)) {
      return omitDeepLodash(obj, props)
    }

    const o = {}
    _.forOwn(obj, (value, key) => {
      o[key] = omitDeepLodash(value, props)
    })

    return _.omit(o, props)
  }

  if (typeof input === "undefined") {
    return undefined
  }

  if (_.isArray(input)) {
    return input.map(omitDeepOnOwnProps)
  }

  return omitDeepOnOwnProps(input)
}

function deepDiff(object, base) {
	function changes(object, base) {
		return _.transform(object, (result, value, key) => {
			if (!_.isEqual(value, base[key])) {
				result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
			}
		})
	}
	return changes(object, base)
}

function displayDiff(obj1, obj2) {
  const diffs = deepDiff(obj1, obj2)
  if (_.isEqual(diffs, {})) {
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
