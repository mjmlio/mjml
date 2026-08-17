import { BodyComponent, makeLowerBreakpoint } from 'mjml-core'

import conditionalTag from 'mjml-core/lib/helpers/conditionalTag'
import genRandomHexString from 'mjml-core/lib/helpers/genRandomHexString'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'

export default class MjNavbar extends BodyComponent {
  static componentName = 'mj-navbar'

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'aria-label': 'string',
    'aria-roledescription': 'string',
    'base-url': 'string',
    hamburger: 'string',
    'ico-align': 'enum(left,center,right)',
    'ico-close': 'string',
    'ico-color': 'color',
    'ico-color--dark': 'color',
    'ico-font-size': 'unit(px,%)',
    'ico-font-family': 'string',
    'ico-line-height': 'unit(px,%,)',
    'ico-open': 'string',
    'ico-padding': 'unit(px,%){1,4}',
    'ico-padding-left': 'unit(px,%)',
    'ico-padding-top': 'unit(px,%)',
    'ico-padding-right': 'unit(px,%)',
    'ico-padding-bottom': 'unit(px,%)',
    'ico-text-decoration': 'string',
    'ico-text-transform': 'string',
    'responsive-mode': 'enum(stack)',
    padding: 'unit(px,%){1,4}',
    'padding-left': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    role: 'string',
  }

  static defaultAttributes = {
    align: 'center',
    'base-url': null,
    hamburger: null,
    'ico-align': 'center',
    'ico-open': '&#9776;',
    'ico-close': '&#8855;',
    'ico-color': '#000000',
    'ico-font-size': '30px',
    'ico-font-family': 'Ubuntu, sans-serif',
    'ico-text-transform': 'uppercase',
    'ico-padding': '10px',
    'ico-line-height': '30px',
  }

  darkClasses = null

  responsiveModeIndex = null

  getDarkClasses() {
    if (this.darkClasses !== null) {
      return this.darkClasses
    }

    this.darkClasses = {}

    const globalData = this.context && this.context.globalData

    const darkIcoColor = this.getAttribute('ico-color--dark')
    if (darkIcoColor) {
      this.darkClasses.icoColor = registerDarkModeRule(globalData, {
        cssProperty: 'color',
        cssValue: darkIcoColor,
      })
    }

    return this.darkClasses
  }

  componentHeadStyle = (breakpoint) => {
    const globalData = this.context && this.context.globalData

    const hasHamburger = this.getAttribute('hamburger') === 'hamburger'

    let hamburgerCss = ''

    if (hasHamburger) {
      const includeStyles =
        !globalData || globalData.navbarHamburgerStyleEmitted === false

      if (includeStyles) {
        if (globalData) {
          globalData.navbarHamburgerStyleEmitted = true
        }
        hamburgerCss = `
      noinput.mj-menu-checkbox { display: block !important; position: absolute; opacity: 0; pointer-events: none; }
      @media only screen and (max-width:${makeLowerBreakpoint(breakpoint)}) {
        .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links,
        .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-open { display:none!important; }
        .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links > a,
        .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-close { display:block!important; }
        .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-inline-links,
        .mj-menu-checkbox[type="checkbox"] ~ .mj-menu-trigger { display:block!important; max-width:none!important; max-height:none!important; font-size:inherit!important; }
        .mj-menu-checkbox[type="checkbox"]:focus-visible~.mj-menu-trigger {
        outline: 5px auto Highlight;
        outline-color: -webkit-focus-ring-color;
    }
      }
    `
      }
    }

    emitDarkModeHeadStyle(globalData)

    const { responsiveModeIndex } = this
    if (responsiveModeIndex != null) {
      const allIndices = (globalData && globalData.navbarresponsiveModeIndices) || [responsiveModeIndex]
      const alreadyEmitted = globalData && globalData.navbarresponsiveModeStyleEmitted

      if (!alreadyEmitted) {
        if (globalData) {
          globalData.navbarresponsiveModeStyleEmitted = true
        }
        const selectors = allIndices
          .map((n) => `        .mj-inline-links-${n} .mj-link`)
          .join(',\n')
        return `${hamburgerCss}
      @media only screen and (max-width:${makeLowerBreakpoint(breakpoint)}) {
${selectors} { display: block !important }
      }
    `
      }
    }

    return hamburgerCss
  }

  getStyles() {
    const icoFontFamilySet =
      this.props && this.props.rawAttrs &&
      Object.prototype.hasOwnProperty.call(this.props.rawAttrs, 'ico-font-family')
    const icoFontSizeSet =
      this.props && this.props.rawAttrs &&
      Object.prototype.hasOwnProperty.call(this.props.rawAttrs, 'ico-font-size')
    const icoLineHeightSet =
      this.props && this.props.rawAttrs &&
      Object.prototype.hasOwnProperty.call(this.props.rawAttrs, 'ico-line-height')

    const effectiveFontFamily = icoFontFamilySet
      ? this.getAttribute('ico-font-family')
      : (this.getAttribute('font-family') || this.constructor.defaultAttributes['ico-font-family'])

    const effectiveFontSize = icoFontSizeSet
      ? this.getAttribute('ico-font-size')
      : (this.getAttribute('font-size') || this.constructor.defaultAttributes['ico-font-size'])
    
    const effectiveLineHeight = icoLineHeightSet
      ? this.getAttribute('ico-line-height')
      : (this.getAttribute('line-height') || this.constructor.defaultAttributes['ico-line-height'])

    return {
      div: {
        align: this.getAttribute('align'),
        width: '100%',
      },
      label: {
        display: 'block',
        cursor: 'pointer',
        'user-select': 'none',
        color: this.getAttribute('ico-color'),
        'font-size': effectiveFontSize,
        'font-family': effectiveFontFamily,
        'text-transform': this.getAttribute('ico-text-transform'),
        'text-decoration': this.getAttribute('ico-text-decoration'),
        'line-height': effectiveLineHeight,
        padding: this.getAttribute('ico-padding'),
        'padding-top': this.getAttribute('ico-padding-top'),
        'padding-right': this.getAttribute('ico-padding-right'),
        'padding-bottom': this.getAttribute('ico-padding-bottom'),
        'padding-left': this.getAttribute('ico-padding-left'),
      },
      trigger: {
        display: 'none',
        'max-height': '0px',
        'max-width': '0px',
        'font-size': '0px',
        overflow: 'hidden',
      },
      icoOpen: {
      },
      icoClose: {
        display: 'none',
      },
    }
  }

  renderHamburger() {
    const labelKey = genRandomHexString(6)

    const supportOutlookClassic =
      !this.context ||
      !this.context.globalData ||
      this.context.globalData.supportOutlookClassic !== false

    const checkbox = `<input type="checkbox" id="${labelKey}" class="mj-menu-checkbox" style="display: block !important; position: absolute; opacity: 0; pointer-events: none;" />\n      `

    const checkboxOutput = supportOutlookClassic
      ? conditionalTag(checkbox, true)
      : checkbox

    return `
      ${checkboxOutput}
      <div
        ${this.htmlAttributes({
          class: 'mj-menu-trigger',
          style: 'trigger',
        })}
      >
        <label
          ${this.htmlAttributes({
            for: labelKey,
            class: ['mj-menu-label', this.getDarkClasses().icoColor]
              .filter(Boolean)
              .join(' '),
            style: 'label',
            align: this.getAttribute('ico-align'),
          })}
        >
          <span
            ${this.htmlAttributes({
              class: 'mj-menu-icon-open',
              style: 'icoOpen',
            })}
          >${this.getAttribute('ico-open')}</span>
          <span
            ${this.htmlAttributes({
              class: 'mj-menu-icon-close',
              style: 'icoClose',
            })}
          >${this.getAttribute('ico-close')}</span>
        </label>
      </div>
    `
  }

  render() {
    if (
      this.getAttribute('responsive-mode') === 'stack' &&
      this.getAttribute('hamburger') !== 'hamburger' &&
      this.responsiveModeIndex == null
    ) {
      const globalData = this.context && this.context.globalData
      if (globalData) {
        if (!Array.isArray(globalData.navbarresponsiveModeIndices)) {
          globalData.navbarresponsiveModeIndices = []
        }
        this.responsiveModeIndex = globalData.navbarresponsiveModeIndices.length + 1
        globalData.navbarresponsiveModeIndices.push(this.responsiveModeIndex)
      } else {
        this.responsiveModeIndex = 1
      }
    }

    const supportOutlookClassic =
      !this.context ||
      !this.context.globalData ||
      this.context.globalData.supportOutlookClassic !== false

    const openTable = supportOutlookClassic
      ? conditionalTag(`<table role="none" border="0" cellpadding="0" cellspacing="0" align="${this.getAttribute(
          'align',
        )}">
            <tr>`)
      : ''

    const closeTable = supportOutlookClassic
      ? conditionalTag(`</tr></table>`)
      : ''

    return `
        ${
          this.getAttribute('hamburger') === 'hamburger'
            ? this.renderHamburger()
            : ''
        }
        <div
          ${this.htmlAttributes({
            role: this.getAttribute('role'),
            'aria-label': this.getAttribute('aria-label'),
            'aria-roledescription': this.getAttribute('aria-roledescription'),
            class: ['mj-inline-links', this.responsiveModeIndex != null ? `mj-inline-links-${this.responsiveModeIndex}` : null]
              .filter(Boolean)
              .join(' '),
            style: this.htmlAttributes('div'),
          })}
        >
        ${openTable}
          ${this.renderChildren(this.props.children, {
            attributes: {
              navbarBaseUrl: this.getAttribute('base-url'),
            },
          })}
          ${closeTable}
        </div>
    `
  }
}
