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
const { registerModifierClassTargets } = require('../lib/helpers/modifierEngine')

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

  it('does not rebuild style blocks when the modifier revision is unchanged', () => {
    const classTargets = new Map()
    const globalData = {
      headRaw: [],
      modifierUseClassTargets: true,
      modifierClassTargets: classTargets,
    }

    const firstClass = registerResponsiveRule(globalData, {
      cssProperty: 'font-size',
      cssValue: '20px',
    })
    const secondClass = registerResponsiveRule(globalData, {
      cssProperty: 'font-size',
      cssValue: '22px',
    })
    registerModifierClassTargets(globalData, firstClass)
    registerModifierClassTargets(globalData, secondClass)

    let classTargetReads = 0
    Object.defineProperty(globalData, 'modifierClassTargets', {
      get() {
        classTargetReads += 1
        return classTargets
      },
    })

    assert.strictEqual(emitResponsiveHeadStyle(globalData), true)
    const readsAfterFirstEmission = classTargetReads
    assert.ok(readsAfterFirstEmission > 0)

    assert.strictEqual(emitResponsiveHeadStyle(globalData), false)
    assert.strictEqual(classTargetReads, readsAfterFirstEmission)
  })

  it('only reads responsive rules on a cache miss, including after a breakpoint change', () => {
    const globalData = { headRaw: [] }
    registerResponsiveRule(globalData, {
      cssProperty: 'font-size',
      cssValue: '20px',
    })
    const rules = globalData.responsiveRules
    let ruleReads = 0
    Object.defineProperty(globalData, 'responsiveRules', {
      get() {
        ruleReads += 1
        return rules
      },
    })

    assert.strictEqual(emitResponsiveHeadStyle(globalData), true)
    const readsAfterFirstEmission = ruleReads
    assert.ok(readsAfterFirstEmission > 0)
    assert.strictEqual(emitResponsiveHeadStyle(globalData), false)
    assert.strictEqual(ruleReads, readsAfterFirstEmission)

    globalData.breakpoint = '600px'
    assert.strictEqual(emitResponsiveHeadStyle(globalData), true)
    assert.ok(ruleReads > readsAfterFirstEmission)
    assert.ok(globalData.headRaw[1].includes('max-width:599px'))
  })

  it('rebuilds style blocks when rules are registered after an emission', () => {
    const globalData = { headRaw: [] }

    registerResponsiveRule(globalData, {
      cssProperty: 'font-size',
      cssValue: '20px',
    })
    assert.strictEqual(emitResponsiveHeadStyle(globalData), true)

    registerResponsiveRule(globalData, {
      cssProperty: 'font-size',
      cssValue: '22px',
    })
    assert.strictEqual(emitResponsiveHeadStyle(globalData), true)
    assert.strictEqual(globalData.headRaw.length, 2)
    assert.ok(globalData.headRaw[1].includes('.mj-responsive-1 { font-size: 20px !important; }'))
    assert.ok(globalData.headRaw[1].includes('.mj-responsive-2 { font-size: 22px !important; }'))
  })

  it('rebuilds cached styles when newly registered class targets overlap', () => {
    const globalData = { headRaw: [], modifierUseClassTargets: true }
    const classes = ['14px', '18px', '14px'].map((value) =>
      registerResponsiveRule(globalData, { cssProperty: 'font-size', cssValue: value }))
    classes.forEach((className) => registerModifierClassTargets(globalData, className))

    assert.strictEqual(emitResponsiveHeadStyle(globalData), true)
    registerModifierClassTargets(globalData, `${classes[0]} ${classes[1]}`)
    registerModifierClassTargets(globalData, `${classes[1]} ${classes[2]}`)
    assert.strictEqual(emitResponsiveHeadStyle(globalData), true)

    const css = globalData.headRaw[1]
    const positions = ['14px', '18px', '14px'].map((value, index) =>
      css.indexOf(`.${classes[index]} { font-size: ${value}`))
    assert.ok(positions.every((position) => position >= 0))
    assert.ok(positions[0] < positions[1] && positions[1] < positions[2])
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