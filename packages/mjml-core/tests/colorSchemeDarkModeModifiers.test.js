const assert = require('assert')

const {
  registerModifier,
  registerModifierRule,
  registerModifierRuleGroup,
  emitModifierHeadStyle,
} = require('../lib/helpers/modifierEngine')

describe('colorSchemeDarkMode modifier helpers', () => {
  it('emits rules for non-dark custom modifiers', () => {
    const globalData = { headRaw: [] }

    registerModifier(globalData, {
      modifier: 'wide',
      mediaQuery: 'only screen and (min-width:480px)',
      classNamespace: 'wide',
    })

    const className = registerModifierRule(globalData, {
      modifier: 'wide',
      cssProperty: 'font-size',
      cssValue: '22px',
    })

    const emitted = emitModifierHeadStyle(globalData)

    assert.strictEqual(className, 'mj-wide-1')
    assert.strictEqual(emitted, true)
    assert.strictEqual(globalData.headRaw.length, 1)
    assert.ok(globalData.headRaw[0].includes('@media only screen and (min-width:480px)'))
    assert.ok(globalData.headRaw[0].includes('.mj-wide-1 { font-size: 22px !important; }'))
  })

  it('uses modifier keyword as class namespace when none is provided', () => {
    const globalData = { headRaw: [] }

    const className = registerModifierRule(globalData, {
      modifier: 'narrow',
      mediaQuery: 'only screen and (max-width:479px)',
      cssProperty: 'line-height',
      cssValue: '22px',
    })

    const emitted = emitModifierHeadStyle(globalData)

    assert.strictEqual(className, 'mj-narrow-1')
    assert.strictEqual(emitted, true)
    assert.ok(globalData.headRaw[0].includes('@media only screen and (max-width:479px)'))
  })

  it('groups multiple declarations under one class using shared engine api', () => {
    const globalData = { headRaw: [] }

    registerModifier(globalData, {
      modifier: 'wide',
      mediaQuery: 'only screen and (min-width:480px)',
      classNamespace: 'wide',
    })

    const className = registerModifierRuleGroup(globalData, {
      modifier: 'wide',
      cssDeclarations: [
        { cssProperty: 'font-size', cssValue: '22px' },
        { cssProperty: 'line-height', cssValue: '30px' },
      ],
    })

    const emitted = emitModifierHeadStyle(globalData)

    assert.strictEqual(className, 'mj-wide-1')
    assert.strictEqual(emitted, true)
    assert.ok(globalData.headRaw[0].includes('.mj-wide-1 { font-size: 22px !important; line-height: 30px !important; }'))
  })

  it('emits distinct style blocks across repeated engine calls with different modifier definitions', () => {
    const globalData = { headRaw: [] }

    const firstEmission = emitModifierHeadStyle(globalData, {
      defaultDefinitions: {
        dark: {
          mediaQuery: '(prefers-color-scheme: dark)',
          classNamespace: 'dark',
        },
      },
      rules: [
        {
          modifier: 'dark',
          className: 'mj-dark-1',
          cssProperty: 'color',
          cssValue: '#00ff00',
          supportModifierSelector: false,
        },
      ],
    })

    const secondEmission = emitModifierHeadStyle(globalData, {
      defaultDefinitions: {
        wide: {
          mediaQuery: 'only screen and (min-width:480px)',
          classNamespace: 'wide',
        },
      },
      rules: [
        {
          modifier: 'wide',
          className: 'mj-wide-1',
          cssProperty: 'font-size',
          cssValue: '22px',
          supportModifierSelector: false,
        },
      ],
    })

    assert.strictEqual(firstEmission, true)
    assert.strictEqual(secondEmission, true)
    assert.strictEqual(globalData.headRaw.length, 2)
  })
})
