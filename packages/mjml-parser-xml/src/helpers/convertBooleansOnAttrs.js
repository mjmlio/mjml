import { mapValues } from 'lodash'

/**
 * Convert "true" and "false" string attributes values
 * to corresponding Booleans
 */

export default function convertBooleansOnAttrs(attrs) {
  return mapValues(attrs, (val, key) => {
    if (key.startsWith('aria-')) {
      return val
    }
    if (val === 'true') {
      return true
    }
    if (val === 'false') {
      return false
    }

    return val
  })
}
