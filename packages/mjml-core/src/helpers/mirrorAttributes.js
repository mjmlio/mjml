import { mapValues } from 'lodash'

const flipped = { left: 'right', right: 'left', ltr: 'rtl' }
const sided = ['align', 'direction', 'text-align']

// Mirrors a component's default attributes for <mjml dir="rtl">. Only
// defaults pass through here, so anything the author set (inline,
// mj-attributes, mj-class) still wins.
// Physical sides only: icon-position is source order, which rtl table
// cells already mirror, so flipping it too would put the icon back.
export default function mirrorAttributes(attributes) {
  return mapValues(attributes, (value, name) => {
    if (sided.includes(name)) {
      return flipped[value] || value
    }

    // four-value padding: swap right and left
    const parts = /padding$/.test(name) && String(value).split(/\s+/)
    if (parts && parts.length === 4) {
      return [parts[0], parts[3], parts[2], parts[1]].join(' ')
    }

    return value
  })
}
