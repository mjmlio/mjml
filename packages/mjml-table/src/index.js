import widthParser from 'mjml-core/lib/helpers/widthParser'

import { BodyComponent } from 'mjml-core'
import {
  DARK_MODE_CLASS_PREFIX,
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import { reduce } from 'lodash'

export default class MjTable extends BodyComponent {
  static componentName = 'mj-table'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,right,center)',
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
    'font-family': 'string',
    'font-size': 'unit(px,rem)',
    'font-weight': 'string',
    'line-height': 'unit(px,%,em,rem)',
    'responsive-mode': 'enum(stack,scroll)',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    role: 'enum(none,presentation,table)',
    'table-layout': 'enum(auto,fixed,initial,inherit)',
    'vertical-align': 'enum(top,bottom,middle)',
    width: 'unit(px,%,auto)',
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

  getAttribute(name) {
    if (name === 'css-class') {
      const base = this.attributes['css-class']
      const containerDarkClass = this.getDarkClasses().container
      return [base, containerDarkClass].filter(Boolean).join(' ') || undefined
    }

    return this.attributes[name]
  }

  componentHeadStyle = () => {
    emitDarkModeHeadStyle(this.context && this.context.globalData)

    const globalData = this.context && this.context.globalData
    if (globalData && globalData.hasStackTable && !globalData.stackTableStyleEmitted) {
      globalData.stackTableStyleEmitted = true
      globalData.headRaw.push(`<style>
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
    const labels = []
    // Only collect <th> labels from the first <tr> that contains them
    html.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, rowContent) => {
      if (labels.length === 0 && /<th[\s>]/i.test(rowContent)) {
        rowContent.replace(/<th(?:\s[^>]*)?>([^]*?)<\/th>/gi, (__, content) => {
          labels.push(content.replace(/<[^>]+>/g, '').trim())
        })
      }
    })

    if (labels.length === 0) return html

    let colIndex = 0
    return html.replace(
      /(<\/?\s*tr\b[^>]*>)|(<th(?:\s[^>]*)?>)|(<td(\s[^>]*)?>)/gi,
      (match, trTag, thTag, _tdTag, tdAttrs) => {
        if (trTag) {
          if (!/^<\//.test(match)) colIndex = 0
          return match
        }
        if (thTag !== undefined) {
          // <th> in any row: advance colIndex but don't inject data-label
          colIndex += 1
          return match
        }
        // It's a <td>
        if (tdAttrs && /\bdata-label\b/i.test(tdAttrs)) {
          colIndex += 1
          return match
        }
        const label = labels[colIndex] ?? ''
        colIndex += 1
        const escapedLabel = label.replace(/"/g, '&quot;')
        return `<td${tdAttrs || ''}${label ? ` data-label="${escapedLabel}"` : ''}>`
      },
    )
  }

  render() {
    const tableDarkClass = this.getDarkClasses().table
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
            width: '100%',
          })}
        >
          <tr>
            <td>
              <div class="mj-scroll-table-inner" role="region" tabindex="0">
                <table
                  ${this.htmlAttributes({
                    ...tableAttributes,
                    width: this.getWidth(),
                    border: '0',
                    class: tableDarkClass || undefined,
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
      [tableDarkClass, responsiveMode === 'stack' ? 'mj-stack-table' : null]
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
