import mapValues from 'lodash/mapValues'

/**
 * Convert "true" and "false" string attributes values
 * to corresponding Booleans
 */

export default function convertBooleansOnAttrs(attrs) {
  return mapValues(attrs, val => {
    if (val === 'true') {
      return true
    }
    if (val === 'false') {
      return false
    }

    return val
  })
}
