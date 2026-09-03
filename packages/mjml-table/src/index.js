import widthParser from 'mjml-core/lib/helpers/widthParser'

import { BodyComponent } from 'mjml-core'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import {
  emitResponsiveHeadStyle,
  buildResponsiveDeclarations,
  registerResponsiveRuleGroup,
  registerResponsivePaddingGroup,
} from 'mjml-core/lib/helpers/responsiveMode'
import { reduce } from 'lodash'

function computeTableAlignMargin(align) {
  if (align === 'left') return '0 auto 0 0'
  if (align === 'right') return '0 0 0 auto'
  return '0 auto'
}

export default class MjTable extends BodyComponent {
  static componentName = 'mj-table'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,right,center)',
    'align--responsive': 'enum(left,right,center)',
    'aria-label': 'string',
    'aria-roledescription': 'string',
    border: 'string',
    'border-color--dark': 'color',
    cellpadding: 'integer',
    cellspacing: 'integer',
    color: 'color',
    'color--dark': 'color',
    'container-background-color': 'color',
    'container-background-color--dark': 'color',
    'container-border-radius': 'string',
    'font-family': 'string',
    'font-size': 'unit(px,rem)',
    'font-size--responsive': 'unit(px,rem)',
    'font-weight': 'string',
    'line-height': 'unit(px,%,em,rem)',
    'line-height--responsive': 'unit(px,%,em,rem)',
    'responsive-mode': 'enum(stack,scroll)',
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
    role: 'enum(none,presentation,table)',
    'table-layout': 'enum(auto,fixed,initial,inherit)',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%,auto)',
    'width--responsive': 'unit(px,%)',
  }

  static defaultAttributes = {
    align: 'left',
    border: 'none',
    cellpadding: '0',
    cellspacing: '0',
    color: '#000000',
    'font-family': 'Ubuntu, sans-serif',
    'font-size': '16px',
    'line-height': '150%',
    padding: '10px 25px',
    width: '100%',
  }

  darkClasses = null

  responsiveClasses = null

  registerDarkModeRuleGroup({
    cssDeclarations,
    supportOutlookDarkMode = false,
  }) {
    const globalData = this.context && this.context.globalData
    const validDeclarations = Array.isArray(cssDeclarations)
      ? cssDeclarations.filter(
          ({ cssProperty, cssValue }) => Boolean(cssProperty && cssValue),
        )
      : []

    if (!globalData || validDeclarations.length === 0) {
      return null
    }

    if (typeof globalData.darkModeRuleCount !== 'number') {
      globalData.darkModeRuleCount = 0
    }

    globalData.darkModeRuleCount += 1

    const className = `${DARK_MODE_CLASS_PREFIX}-${globalData.darkModeRuleCount}`

    if (!Array.isArray(globalData.darkModeRules)) {
      globalData.darkModeRules = []
    }

    validDeclarations.forEach(({ cssProperty, cssValue }) => {
      globalData.darkModeRules.push({
        className,
        cssProperty,
        cssValue,
        supportOutlookDarkMode: Boolean(supportOutlookDarkMode),
      })
    })

    return className
  }

  getDarkClasses() {
    if (this.darkClasses !== null) {
      return this.darkClasses
    }

    this.darkClasses = {}

    const globalData = this.context && this.context.globalData

    const darkContainerBg = this.attributes['container-background-color--dark']
    if (darkContainerBg) {
      this.darkClasses.container = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      })
    }

    const tableDarkDeclarations = [
      {
        cssProperty: 'border-color',
        cssValue: this.attributes['border-color--dark'],
      },
      {
        cssProperty: 'color',
        cssValue: this.attributes['color--dark'],
      },
    ]

    this.darkClasses.table = this.registerDarkModeRuleGroup({
      cssDeclarations: tableDarkDeclarations,
    })

    return this.darkClasses
  }

  getResponsiveClasses() {
    if (this.responsiveClasses !== null) return this.responsiveClasses

    this.responsiveClasses = {
      container: null,
      table: null,
    }

    const globalData = this.context && this.context.globalData

    this.responsiveClasses.container = registerResponsivePaddingGroup(globalData, this.attributes)

    this.responsiveClasses.table = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: buildResponsiveDeclarations([
        ['font-size', this.attributes['font-size--responsive']],
        ['line-height', this.attributes['line-height--responsive']],
        ['width', this.attributes['width--responsive']],
        ['margin', this.attributes['align--responsive']
          ? computeTableAlignMargin(this.attributes['align--responsive'])
          : null],
      ]),
    })

    return this.responsiveClasses
  }

  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const containerDarkClass = this.getDarkClasses().container
      const containerResponsiveClass = this.getResponsiveClasses().container
      return [base, containerDarkClass, containerResponsiveClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    emitResponsiveHeadStyle(this.context && this.context.globalData)

    const globalData = this.context && this.context.globalData
    if (globalData && globalData.hasScrollTable && !globalData.scrollTableStyleEmitted) {
      globalData.scrollTableStyleEmitted = true
      globalData.headRaw.push(`<style>
    .mj-scroll-table-outer {
      table-layout: fixed;
    }

    .mj-scroll-table-inner {
      overflow: auto;
    }

    .mj-scroll-table-inner table {
      margin: 0;
      border: none;
      word-break: keep-all;
    }
  </style>`)
    }

    if (globalData && globalData.hasStackTable && !globalData.stackTableStyleEmitted) {
      globalData.stackTableStyleEmitted = true
      globalData.headRaw.push(`<style id="mj-stack-table">
    @media screen and (max-width: 479px) {
      .mj-stack-table :is(caption + tbody, tbody:first-child, thead) > tr:first-child,
      .mj-stack-table:is(table) tbody th {
        border: none;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      .mj-stack-table:is(table) tr:not(:last-child) {
        display: block;
      }

      .mj-stack-table:is(table) td {
        display: block;
        text-align: right;
      }

      .mj-stack-table:is(table) td:before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
      }
    }
  </style>`)
    }

    return ''
  }

  getStyles() {
    const hasCellspacing = this.hasCellspacing()
    return {
      table: {
        color: this.getAttribute('color'),
        'font-family': this.getAttribute('font-family'),
        'font-size': this.getAttribute('font-size'),
        'line-height': this.getAttribute('line-height'),
        'mso-line-height-alt': '120%',
        ...(this.getAttribute('table-layout') !== 'auto' && { 'table-layout': this.getAttribute('table-layout') }),
        ...(this.getAttribute('width') !== 'auto' && { width: this.getAttribute('width') }),
        border: this.getAttribute('border'),
        ...(hasCellspacing && { 'border-collapse': 'separate' }),
      },
    }
  }

  getWidth() {
    const width = this.getAttribute('width')

    if (width === 'auto') {
      return null
    }

    const { parsedWidth, unit } = widthParser(width)
    return unit === '%' ? width : parsedWidth
  }

  hasCellspacing() {
    const cellspacing = this.getAttribute('cellspacing')
    const numericValue = parseFloat(String(cellspacing).replace(/[^\d.]/g, ''))
    return !Number.isNaN(numericValue) && numericValue > 0
  }

  static injectDataLabels(html) {
    // Matches only the tags relevant to scoping and label injection; a
    // nested <table> pushes tableDepth above 0 so its rows/cells are skipped.
    const tagRe = /<table(?:\s[^>]*)?>|<\/table\s*>|<tr(?:\s[^>]*)?>|<\/tr\s*>|<th(?:\s[^>]*)?>|<\/th\s*>|<td(?:\s[^>]*)?>/gi

    // Pass 1: collect <th> labels from the first top-level row that has them,
    // ignoring any <th> that belongs to a nested table.
    const labels = []
    let tableDepth = 0
    let foundLabelRow = false
    let inLabelRow = false
    let collecting = false
    let labelStart = 0
    for (let match = tagRe.exec(html); match !== null; match = tagRe.exec(html)) {
      const tag = match[0]
      if (/^<table/i.test(tag)) {
        tableDepth += 1
      } else if (/^<\/table/i.test(tag)) {
        tableDepth = Math.max(0, tableDepth - 1)
      } else if (tableDepth === 0 && /^<\/tr/i.test(tag)) {
        if (inLabelRow) foundLabelRow = true
        inLabelRow = false
      } else if (tableDepth === 0 && /^<th/i.test(tag) && !foundLabelRow) {
        collecting = true
        inLabelRow = true
        labelStart = match.index + tag.length
      } else if (tableDepth === 0 && /^<\/th/i.test(tag) && collecting) {
        labels.push(html.slice(labelStart, match.index).replace(/<[^>]+>/g, '').trim())
        collecting = false
      }
    }

    if (labels.length === 0) return html

    // Pass 2: inject data-label onto top-level <td> cells only; nested tables
    // are left untouched and don't affect colIndex.
    tableDepth = 0
    let colIndex = 0
    return html.replace(tagRe, (tag) => {
      if (/^<table/i.test(tag)) {
        tableDepth += 1
        return tag
      }
      if (/^<\/table/i.test(tag)) {
        tableDepth = Math.max(0, tableDepth - 1)
        return tag
      }
      if (tableDepth !== 0) {
        return tag
      }
      if (/^<tr/i.test(tag)) {
        colIndex = 0
        return tag
      }
      if (/^<\/tr/i.test(tag) || /^<\/th/i.test(tag)) {
        return tag
      }
      if (/^<th/i.test(tag)) {
        // <th> in any row: advance colIndex but don't inject data-label
        colIndex += 1
        return tag
      }
      // It's a top-level <td>
      if (/\bdata-label\b/i.test(tag)) {
        colIndex += 1
        return tag
      }
      const label = labels[colIndex] ?? ''
      colIndex += 1
      if (!label) return tag
      const escapedLabel = label.replace(/"/g, '&quot;')
      return tag.replace(/>$/, ` data-label="${escapedLabel}">`)
    })
  }

  render() {
    const tableDarkClass = this.getDarkClasses().table
    const tableResponsiveClass = this.getResponsiveClasses().table
    const responsiveMode = this.getAttribute('responsive-mode')
    const globalData = this.context && this.context.globalData

    if (responsiveMode === 'stack' && globalData) {
      globalData.hasStackTable = true
    }

    if (responsiveMode === 'scroll' && globalData) {
      globalData.hasScrollTable = true
    }

    const tableAttributes = reduce(
      ['aria-label', 'aria-roledescription', 'cellpadding', 'cellspacing', 'role'],
      (acc, v) => ({
        ...acc,
        [v]: this.getAttribute(v),
      }),
      {},
    )

    const content =
      responsiveMode === 'stack'
        ? MjTable.injectDataLabels(this.getContent())
        : this.getContent()

    if (responsiveMode === 'scroll') {
      return `
        <table
          ${this.htmlAttributes({
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            class: 'mj-scroll-table-outer',
            role: 'none',
            width: '100%',
          })}
        >
          <tr>
            <td>
              <div class="mj-scroll-table-inner" tabindex="0">
                <table
                  ${this.htmlAttributes({
                    ...tableAttributes,
                    width: this.getWidth(),
                    border: '0',
                    class: [tableDarkClass, tableResponsiveClass].filter(Boolean).join(' ') || undefined,
                    style: 'table',
                  })}
                >
                  ${content}
                </table>
              </div>
            </td>
          </tr>
        </table>
      `
    }

    const tableClass =
      [tableDarkClass, tableResponsiveClass, responsiveMode === 'stack' ? 'mj-stack-table' : null]
        .filter(Boolean)
        .join(' ') || undefined

    return `
      <table
        ${this.htmlAttributes({
          ...tableAttributes,
          width: this.getWidth(),
          border: '0',
          class: tableClass,
          style: 'table',
        })}
      >
        ${content}
      </table>
    `
  }
}
