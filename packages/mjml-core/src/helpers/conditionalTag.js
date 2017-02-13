export const startConditionalTag = '<!--[if mso | IE]>'
export const endConditionalTag = '<![endif]-->'
export const startNegationConditionalTag = '<!--[if !mso | IE]><!-->'
export const endNegationConditionalTag = '<!--<![endif]-->'

export default function conditionalTag (content, negation = false) {
  return `
    ${negation ? startNegationConditionalTag : startConditionalTag}
    ${content}
    ${negation ? endNegationConditionalTag : endConditionalTag}
  `
}
