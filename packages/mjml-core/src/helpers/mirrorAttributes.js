const flipped = { left: 'right', right: 'left', ltr: 'rtl' }
const sided = ['align', 'direction', 'text-align']

// Splits on whitespace outside parentheses, so calc(a + b) stays one value.
function splitValues(value) {
  const parts = ['']
  let depth = 0
  for (const char of String(value).trim()) {
    if (char === '(') depth += 1
    if (char === ')') depth -= 1
    if (depth === 0 && /\s/.test(char)) {
      if (parts[parts.length - 1]) parts.push('')
    } else {
      parts[parts.length - 1] += char
    }
  }
  return parts
}

function mirrorValue(name, value) {
  if (sided.includes(name)) {
    return flipped[value] || value
  }

  // four-value padding: swap right and left
  if (/padding$/.test(name)) {
    const parts = splitValues(value)
    if (parts.length === 4) {
      return [parts[0], parts[3], parts[2], parts[1]].join(' ')
    }
  }

  return value
}

// Mirrors a component's default attributes for <mjml dir="rtl">. Only
// defaults pass through here, so anything the author set (inline,
// mj-attributes, mj-class) still wins.
// Physical sides only: icon-position is source order, which rtl table
// cells already mirror, so flipping it too would put the icon back.
// *-left/*-right attributes trade values; left-icon and right-icon name
// controls, not sides, and stay put.
export default function mirrorAttributes(attributes) {
  const mirrored = {}
  Object.entries(attributes).forEach(([name, value]) => {
    const target = name.replace(/-(left|right)$/, (_, side) =>
      side === 'left' ? '-right' : '-left',
    )
    mirrored[target] = mirrorValue(name, value)
  })
  return mirrored
}
