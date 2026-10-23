const assert = require('assert')

const {
  registerResponsiveRule,
  registerResponsiveRuleGroup,
  emitResponsiveHeadStyle,
} = require('../lib/helpers/responsiveMode')
const {
  registerDarkModeRule,
  emitDarkModeHeadStyle,
} = require('../lib/helpers/colorSchemeDarkMode')

describe('responsiveMode modifier helpers', () => {
  it('registers responsive rules with dedicated class names and emits style', () => {
    const globalData = { headRaw: [] }

    const className = registerResponsiveRule(globalData, {
      cssProperty: 'font-size',
      cssValue: '22px',
    })

    const emitted = emitResponsiveHeadStyle(globalData)

    assert.strictEqual(className, 'mj-responsive-1')
    assert.strictEqual(emitted, true)
    assert.strictEqual(globalData.headRaw.length, 1)
    assert.ok(globalData.headRaw[0].includes('@media only screen and (max-width:479px)'))
    assert.ok(globalData.headRaw[0].includes('.mj-responsive-1 { font-size: 22px !important; }'))
  })

  it('is idempotent after first style emission', () => {
    const globalData = { headRaw: [] }

    registerResponsiveRule(globalData, {
      cssProperty: 'line-height',
      cssValue: '28px',
    })

    const firstEmission = emitResponsiveHeadStyle(globalData)
    const secondEmission = emitResponsiveHeadStyle(globalData)

    assert.strictEqual(firstEmission, true)
    assert.strictEqual(secondEmission, false)
    assert.strictEqual(globalData.headRaw.length, 1)
  })

  it('groups multiple declarations under one class when using rule groups', () => {
    const globalData = { headRaw: [] }

    const className = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: [
        { cssProperty: 'padding-top', cssValue: '44px' },
        { cssProperty: 'padding-right', cssValue: '55px' },
      ],
    })

    const emitted = emitResponsiveHeadStyle(globalData)

    assert.strictEqual(className, 'mj-responsive-1')
    assert.strictEqual(emitted, true)
    assert.ok(globalData.headRaw[0].includes('.mj-responsive-1 { padding-top: 44px !important; padding-right: 55px !important; }'))
  })

  it('supports per-declaration selector suffixes and selector-suffix arrays in one rule group', () => {
    const globalData = { headRaw: [] }

    const className = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: [
        {
          cssProperty: 'height',
          cssValue: '30px',
          selectorSuffix: ['', ' td'],
        },
        {
          cssProperty: 'width',
          cssValue: '20px',
          selectorSuffix: ' img',
        },
      ],
    })

    const emitted = emitResponsiveHeadStyle(globalData)

    assert.strictEqual(className, 'mj-responsive-1')
    assert.strictEqual(emitted, true)
    assert.ok(globalData.headRaw[0].includes('.mj-responsive-1,\n  .mj-responsive-1 td { height: 30px !important; }'))
    assert.ok(globalData.headRaw[0].includes('.mj-responsive-1 img { width: 20px !important; }'))
  })

  it('returns null when registerResponsiveRuleGroup is called with no valid declarations', () => {
    const globalData = { headRaw: [] }

    const nullFromEmpty = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: [],
    })

    const nullFromFalsy = registerResponsiveRuleGroup(globalData, {
      cssDeclarations: [
        { cssProperty: 'font-size', cssValue: null },
        { cssProperty: '', cssValue: '22px' },
      ],
    })

    assert.strictEqual(nullFromEmpty, null)
    assert.strictEqual(nullFromFalsy, null)
    assert.strictEqual(globalData.headRaw.length, 0)
  })

  it('assigns distinct incrementing class names across multiple registrations', () => {
    const globalData = { headRaw: [] }

    const first = registerResponsiveRule(globalData, {
      cssProperty: 'font-size',
      cssValue: '22px',
    })

    const second = registerResponsiveRule(globalData, {
      cssProperty: 'line-height',
      cssValue: '30px',
    })

    emitResponsiveHeadStyle(globalData)

    assert.strictEqual(first, 'mj-responsive-1')
    assert.strictEqual(second, 'mj-responsive-2')
    assert.strictEqual(globalData.headRaw.length, 1)
    assert.ok(globalData.headRaw[0].includes('.mj-responsive-1 { font-size: 22px !important; }'))
    assert.ok(globalData.headRaw[0].includes('.mj-responsive-2 { line-height: 30px !important; }'))
  })

  it('emits both dark and responsive styles when both helpers are used', () => {
    const globalData = { headRaw: [] }

    registerDarkModeRule(globalData, {
      cssProperty: 'color',
      cssValue: '#00ff00',
    })

    registerResponsiveRule(globalData, {
      cssProperty: 'font-size',
      cssValue: '22px',
    })

    const darkEmitted = emitDarkModeHeadStyle(globalData)
    const responsiveEmitted = emitResponsiveHeadStyle(globalData)

    assert.strictEqual(darkEmitted, true)
    assert.strictEqual(responsiveEmitted, true)
    assert.strictEqual(globalData.headRaw.length, 2)
    assert.ok(globalData.headRaw.some((style) => style.includes('@media (prefers-color-scheme: dark)')))
    assert.ok(globalData.headRaw.some((style) => style.includes('@media only screen and (max-width:479px)')))
  })
})