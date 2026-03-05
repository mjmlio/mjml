import ruleError from './ruleError'

export default function requiredTitle(element) {
  const { tagName, children } = element

  // On root mjml, detect missing head/title
  if (tagName === 'mjml') {
    const rootChildren = Array.isArray(children) ? children : []
    const headEl = rootChildren.find((c) => c && c.tagName === 'mj-head')
    if (!headEl) {
      return ruleError(
        'Missing mj-title. Provide non-empty content for a valid <title>.',
        element,
      )
    }
    const headChildren = Array.isArray(headEl.children) ? headEl.children : []
    const titleEl = headChildren.find((c) => c && c.tagName === 'mj-title')
    if (!titleEl) {
      return ruleError(
        'Missing mj-title. Provide non-empty content for a valid <title>.',
        headEl,
      )
    }
    // If present, the empty case will be handled when visiting mj-head
    return null
  }

  // On mj-head, warn only when an explicit mj-title is provided but empty/whitespace.
  if (tagName !== 'mj-head') return null

  const headChildren = Array.isArray(children) ? children : []
  const titleEl = headChildren.find((c) => c && c.tagName === 'mj-title')
  if (!titleEl) return null

  const content = (titleEl.content || '').trim()
  if (!content) {
    return ruleError(
      'Empty mj-title. Provide non-empty content for a valid <title>.',
      titleEl,
    )
  }

  return null
}
