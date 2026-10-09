export const startConditionalTag = '<!--[if mso]>'
export const startMsoConditionalTag = '<!--[if mso]>'
export const endConditionalTag = '<![endif]-->'
export const startNegationConditionalTag = '<!--[if !mso]><!-->'
export const startMsoNegationConditionalTag = '<!--[if !mso]><!-->'
export const endNegationConditionalTag = '<!--<![endif]-->'

let supportOutlookClassic = true

export function setSupportOutlookClassicFlag(enabled) {
  supportOutlookClassic = enabled !== false
}

export default function conditionalTag(content, negation = false) {
  if (!supportOutlookClassic) {
    return content
  }

  return `${negation ? startNegationConditionalTag : startConditionalTag}
    ${content}
    ${negation ? endNegationConditionalTag : endConditionalTag}`
}

export function msoConditionalTag(content, negation = false) {
  if (!supportOutlookClassic) {
    return ''
  }

  return `${negation ? startMsoNegationConditionalTag : startMsoConditionalTag}
    ${content}
    ${negation ? endNegationConditionalTag : endConditionalTag}`
}
