import ruleError from './ruleError'

// List of attributes that require support-dark-mode="true" to work properly
const DARK_MODE_ATTRIBUTES = [
  'dark-background-color',
  'dark-background-url',
  'dark-border-color',
  'dark-border-bottom-color',
  'dark-border-left-color',
  'dark-border-right-color',
  'dark-border-top-color',
  'dark-color',
  'dark-container-background-color',
  'dark-inner-background-color',
  'dark-inner-border-color',
  'dark-inner-border-bottom-color',
  'dark-inner-border-left-color',
  'dark-inner-border-right-color',
  'dark-inner-border-top-color',
  'dark-ico-color',
  'dark-icon-wrapped-url',
  'dark-icon-unwrapped-url',
  'dark-left-icon',
  'dark-right-icon',
  'dark-src',
  'dark-tb-border-color',
  'dark-tb-hover-border-color',
  'dark-tb-selected-border-color',
  'dark-thumbnails-src',
]

function formatAttributeList(attributes) {
  if (attributes.length === 1) {
    return attributes[0]
  }
  if (attributes.length === 2) {
    return `${attributes[0]} and ${attributes[1]}`
  }
  // For 3+, use Oxford comma
  return `${attributes.slice(0, -1).join(', ')} and ${attributes[attributes.length - 1]}`
}

function getElementDarkModeAttributes(element, components) {
  if (!element || !components) {
    return []
  }

  const Component = components[element.tagName]
  if (!Component || !Component.allowedAttributes) {
    return []
  }

  const elementAttributes = (element && element.attributes) || {}
  const foundAttributes = []

  DARK_MODE_ATTRIBUTES.forEach((attrName) => {
    if (
      Object.prototype.hasOwnProperty.call(Component.allowedAttributes, attrName) &&
      Object.prototype.hasOwnProperty.call(elementAttributes, attrName)
    ) {
      foundAttributes.push(attrName)
    }
  })

  return foundAttributes
}

function findElementsWithDarkModeAttributes(element, components, output = []) {
  if (!element) {
    return output
  }

  const darkModeAttributes = getElementDarkModeAttributes(element, components)
  if (darkModeAttributes.length > 0) {
    output.push({ element, attributes: darkModeAttributes })
  }

  const children = Array.isArray(element.children) ? element.children : []
  children.forEach((child) => findElementsWithDarkModeAttributes(child, components, output))

  return output
}

export default function requireSupportDarkModeForDarkSrc(element, { components }) {
  if (!element || element.tagName !== 'mjml') {
    return null
  }

  const rootSupportDarkMode =
    String((element.attributes || {})['support-dark-mode'] || false).toLowerCase() ===
    'true'

  if (rootSupportDarkMode) {
    return null
  }

  const elementsWithDarkModeAttributes = findElementsWithDarkModeAttributes(element, components)
  if (elementsWithDarkModeAttributes.length === 0) {
    return null
  }

  return elementsWithDarkModeAttributes.map(({ element: darkModeElement, attributes }) => {
    const attributeList = formatAttributeList(attributes)
    const verb = attributes.length === 1 ? 'requires' : 'require'
    const noun = attributes.length === 1 ? 'Attribute' : 'Attributes'

    return ruleError(
      `${noun} ${attributeList} ${verb} support-dark-mode="true" on the root <mjml> element to work reliably across supported email clients.`,
      darkModeElement,
    )
  })
}