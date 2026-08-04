import { BodyComponent } from 'mjml-core'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  registerResponsiveRuleGroup,
  buildResponsiveDeclarations,
  registerResponsivePaddingGroup,
} from 'mjml-core/lib/helpers/responsiveMode'

// ─── normalize-elements helpers ───────────────────────────────────────────────

const VALID_NORMALIZE_ELEMENTS = ['ul', 'ol']
const NORMALIZE_STYLE_FLAG = 'normalizeElementsStyleEmitted'

const NORMALIZE_MSO_HEAD_STYLE = `<!--[if mso]>
<style type="text/css">
  .normalize ul, .normalize ol { margin-left: -20px !important; }
  .normalize li { margin-left: 0 !important; padding-left: 0 !important; }
  .normalize ol ul { margin-left: -30px !important; }
</style>
<![endif]-->`

/** Extract the raw value string of a style="..." or style='...' attribute. */
function extractStyleAttr(attrs) {
  const dq = /style\s*=\s*"([^"]*)"/i.exec(attrs)
  if (dq) return dq[1]
  const sq = /style\s*=\s*'([^']*)'/i.exec(attrs)
  return sq ? sq[1] : ''
}

/**
 * Return true when the style declaration string already contains the exact
 * shorthand property (e.g. 'padding' or 'margin').  Individual sub-properties
 * like 'padding-left' are intentionally ignored — they will simply appear after
 * our injected shorthand and override the relevant sub-value via CSS cascade.
 */
function hasStyleProp(styleStr, prop) {
  return new RegExp(`(?:^|;)\\s*${prop}\\s*:`, 'i').test(styleStr)
}

/** Replace (or create) the style attribute in a tag attrs string. */
function setStyleAttr(attrs, newStyle) {
  if (/style\s*=\s*"[^"]*"/i.test(attrs)) {
    return attrs.replace(/style\s*=\s*"[^"]*"/i, `style="${newStyle}"`)
  }
  if (/style\s*=\s*'[^']*'/i.test(attrs)) {
    return attrs.replace(/style\s*=\s*'[^']*'/i, `style="${newStyle}"`)
  }
  return `${attrs} style="${newStyle}"`
}

/**
 * Walk the HTML string and inject inline styles onto the
 * specified list elements (ul/ol) and their <li> descendants so that they
 * render consistently across email clients.
 *
 * Uses a stack-based tag scanner rather than a DOM library so that it works
 * in browser environments where cheerio is not available.
 */
function normalizeListContent(html, elements) {
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?>/g
  const foundTags = []
  for (let m = tagRe.exec(html); m !== null; m = tagRe.exec(html)) {
    foundTags.push({
      start: m.index,
      end: m.index + m[0].length,
      isClose: m[1] === '/',
      tagName: m[2].toLowerCase(),
      attrs: m[3] || '',
    })
  }

  // Stack tracks open lists; each entry owns its direct <li> children.
  const listStack = []
  const listPatches = []
  const liItems = []

  for (const t of foundTags) {
    if (!t.isClose && elements.includes(t.tagName)) {
      // Opening a normalised list: schedule a patch and push onto the stack.
      const existingStyle = extractStyleAttr(t.attrs)
      const injected = []
      if (!hasStyleProp(existingStyle, 'padding')) injected.push('padding: 0')
      if (!hasStyleProp(existingStyle, 'margin')) injected.push('margin: 0')

      let newAttrs = t.attrs
      if (injected.length > 0) {
        const base = existingStyle.trim().replace(/;\s*$/, '').trim()
        const newStyle = base
          ? `${injected.join('; ')}; ${base}`
          : injected.join('; ')
        newAttrs = setStyleAttr(t.attrs, newStyle)
      }

      listPatches.push({
        start: t.start,
        end: t.end,
        newContent: `<${t.tagName}${newAttrs}>`,
      })
      listStack.push({ tag: t.tagName, liItems: [] })
    } else if (t.isClose && elements.includes(t.tagName) && listStack.length > 0) {
      // Closing a list: mark first/last among its direct <li> children.
      const list = listStack.pop()
      list.liItems.forEach((li, i) => {
        li.isFirst = i === 0
        li.isLast = i === list.liItems.length - 1
        liItems.push(li)
      })
    } else if (!t.isClose && t.tagName === 'li' && listStack.length > 0) {
      // Register this <li> with the innermost active list.
      listStack[listStack.length - 1].liItems.push({
        start: t.start,
        end: t.end,
        attrs: t.attrs,
        listType: listStack[listStack.length - 1].tag,
        isFirst: false,
        isLast: false,
      })
    }
  }

  const patches = [...listPatches]
  for (const li of liItems) {
    const marginTop = li.isFirst ? '10px' : '0'
    const marginBottom = li.isLast ? '10px' : '5px'

    let { attrs } = li
    if (!hasStyleProp(extractStyleAttr(attrs), 'margin')) {
      const existingStyle = extractStyleAttr(attrs).trim().replace(/;\s*$/, '').trim()
      const marginLeft = li.listType === 'ol' ? '21px' : '18px'
      const marginDecl = `margin: ${marginTop} 0 ${marginBottom} ${marginLeft}`
      const newStyle = existingStyle ? `${marginDecl}; ${existingStyle}` : marginDecl
      attrs = setStyleAttr(attrs, newStyle)
    }
    patches.push({ start: li.start, end: li.end, newContent: `<li${attrs}>` })
  }

  // Apply patches from the end of the string backwards so positions stay valid.
  patches.sort((a, b) => b.start - a.start)
  let result = html
  for (const patch of patches) {
    result = result.slice(0, patch.start) + patch.newContent + result.slice(patch.end)
  }
  return result
}

/**
 * Push the MSO conditional style block into globalData.headRaw exactly once
 * per document, regardless of how many mj-text components use normalize-elements.
 */
function emitNormalizeHeadStyle(globalData) {
  if (!globalData || globalData[NORMALIZE_STYLE_FLAG]) return
  globalData[NORMALIZE_STYLE_FLAG] = true
  if (!Array.isArray(globalData.headRaw)) globalData.headRaw = []
  globalData.headRaw.push(NORMALIZE_MSO_HEAD_STYLE)
}

// ──────────────────────────────────────────────────────────────────────────────

export default class MjText extends BodyComponent {
  static componentName = 'mj-text'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,right,center,justify)',
    'align--responsive': 'enum(left,right,center,justify)',
    color: 'color',
    'color--dark': 'color',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-size--responsive': 'unit(px)',
    'font-style': 'string',
    'font-weight': 'string',
    height: 'unit(px,%)',
    'height--responsive': 'unit(px,%)',
    'letter-spacing': 'unitWithNegative(px,em)',
    'line-height': 'unit(px,%)',
    'line-height--responsive': 'unit(px,%)',
    'normalize-elements': 'string',
    padding: 'unit(px,%){1,4}',
    'padding--responsive': 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-bottom--responsive': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-left--responsive': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-right--responsive': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding-top--responsive': 'unit(px,%)',
    'text-decoration': 'string',
    'text-transform': 'string',
    'vertical-align': 'enum(top,bottom,middle)',
  }

  // Lazily register both dark-mode rules on first access so the sequential
  // counter is stable regardless of whether getAttribute or renderContent runs first.
  darkClasses = null

  responsiveClasses = null

  getDarkClasses() {
    if (this.darkClasses !== null) return this.darkClasses
    this.darkClasses = {}
    const globalData = this.context && this.context.globalData

    const darkContainerBg = this.attributes['container-background-color--dark']
    if (darkContainerBg) {
      this.darkClasses.container = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      })
    }

    const darkColor = this.attributes['color--dark']
    if (darkColor) {
      this.darkClasses.color = registerDarkModeRule(globalData, {
        cssProperty: 'color',
        cssValue: darkColor,
      })
    }

    return this.darkClasses
  }

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) return this.responsiveClasses

    this.responsiveClasses = {
      container: null,
      text: null,
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses.container = registerResponsivePaddingGroup(globalData, this.attributes)

    this.responsiveClasses.text = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['font-size', this.attributes['font-size--responsive']],
        ['line-height', this.attributes['line-height--responsive']],
        ['text-align', this.attributes['align--responsive']],
        ['height', this.attributes['height--responsive']],
      ]),
    })

    return this.responsiveClasses
  }

  // Merge the container dark class into css-class so the parent column applies
  // it to the wrapping <td> element (which is where container-background-color
  // is rendered as an inline style).
  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const containerDarkClass = this.getDarkClasses().container
      const containerResponsiveClass = this.getResponsiveClasses().container
      return [base, containerDarkClass, containerResponsiveClass]
        .filter(Boolean)
        .join(' ') || undefined
    }
    return this.attributes[name]
  }

  getNormalizeElements() {
    const val = this.attributes['normalize-elements']
    if (!val) return []
    return val
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => VALID_NORMALIZE_ELEMENTS.includes(s))
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    emitResponsiveHeadStyle(this.context && this.context.globalData)
    if (this.getNormalizeElements().length > 0) {
      emitNormalizeHeadStyle(this.context && this.context.globalData)
    }
    return ''
  }

  static defaultAttributes = {
    align: 'left',
    color: '#000000',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '16px',
    'line-height': '150%',
    padding: '10px 25px',
  }

  getStyles() {
    return {
      text: {
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'font-style': this.getAttribute('font-style'),
        'font-weight': this.getAttribute('font-weight'),
        'letter-spacing': this.getAttribute('letter-spacing'),
        'line-height': this.getAttribute('line-height'),
        'mso-line-height-alt': '120%',
        'text-align': this.getAttribute('align'),
        'text-decoration': this.getAttribute('text-decoration'),
        'text-transform': this.getAttribute('text-transform'),
        color: this.getAttribute('color'),
        height: this.getAttribute('height'),
      },
    }
  }

  renderContent() {
    const colorDarkClass = this.getDarkClasses().color
    const textResponsiveClass = this.getResponsiveClasses().text
    const normalizeElements = this.getNormalizeElements()
    const hasNormalize = normalizeElements.length > 0

    const classes = [colorDarkClass, textResponsiveClass, hasNormalize ? 'normalize' : null]
      .filter(Boolean)
      .join(' ') || null

    const content = hasNormalize
      ? normalizeListContent(this.getContent(), normalizeElements)
      : this.getContent()

    return `<div
        ${this.htmlAttributes({
          style: 'text',
          class: classes,
        })}
      >${content}</div>`
  }

  render() {
    const height = this.getAttribute('height')

    const supportOutlookClassic =
      !this.context ||
      !this.context.globalData ||
      this.context.globalData.supportOutlookClassic !== false

    if (!height || !supportOutlookClassic) {
      return this.renderContent()
    }

    return `${conditionalTag(`<table role="none" border="0" cellpadding="0" cellspacing="0"><tr><td height="${height}" style="vertical-align:top;height:${height};">`)}
        ${this.renderContent()}
        ${conditionalTag(`</td></tr></table>`)}
      `
  }
}
