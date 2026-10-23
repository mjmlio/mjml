import ruleError from './ruleError'
import { findElementsWithDarkModeAttributes } from './requireSupportDarkModeForDarkSrc'

// gmail-force-light-mode="true" outputs a "light only" color-scheme meta tag,
// so --dark attributes will not be displayed in the Gmail apps
export default function gmailForceLightModeWithDarkAttributes(element, { components }) {
  if (!element || element.tagName !== 'mjml') {
    return null
  }

  const rootGmailForceLightMode =
    String((element.attributes || {})['gmail-force-light-mode'] || false).toLowerCase() ===
    'true'

  if (!rootGmailForceLightMode) {
    return null
  }

  const elementsWithDarkModeAttributes = findElementsWithDarkModeAttributes(element, components)
  if (elementsWithDarkModeAttributes.length === 0) {
    return null
  }

  return ruleError(
    'gmail-force-light-mode="true" is set, so Gmail apps will show light mode and --dark attributes will not be displayed in Gmail. They still apply in other email clients that support dark mode.',
    element,
  )
}
