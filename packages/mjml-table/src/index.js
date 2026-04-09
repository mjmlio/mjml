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
    border: 'string',
    cellpadding: 'integer',
    cellspacing: 'integer',
    color: 'color',
    'container-background-color': 'color',
    'dark-border-color': 'color',
    'dark-color': 'color',
    'dark-container-background-color': 'color',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-weight': 'string',
    'line-height': 'unit(px,%,)',
    padding: 'unit(px,%){1,4}',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    role: 'enum(none,presentation)',
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
    'font-size': '13px',
    'line-height': '22px',
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

    const darkContainerBg = this.attributes['dark-container-background-color']
    if (darkContainerBg) {
      this.darkClasses.container = registerDarkModeRule(globalData, {
        cssProperty: 'background-color',
        cssValue: darkContainerBg,
      })
    }

    const tableDarkDeclarations = [
      {
        cssProperty: 'border-color',
        cssValue: this.attributes['dark-border-color'],
      },
      {
        cssProperty: 'color',
        cssValue: this.attributes['dark-color'],
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

  render() {
    const tableDarkClass = this.getDarkClasses().table

    const tableAttributes = reduce(
      ['cellpadding', 'cellspacing', 'role'],
      (acc, v) => ({
        ...acc,
        [v]: this.getAttribute(v),
      }),
      {},
    )

    return `
      <table
        ${this.htmlAttributes({
          ...tableAttributes,
          width: this.getWidth(),
          border: '0',
          class: tableDarkClass || undefined,
          style: 'table',
        })}
      >
        ${this.getContent()}
      </table>
    `
  }
}
