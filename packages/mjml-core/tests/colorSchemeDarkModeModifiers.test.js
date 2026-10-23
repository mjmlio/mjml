const assert = require('assert')

const {
  registerModifier,
  registerModifierRule,
  registerModifierRuleGroup,
  emitModifierHeadStyle,
} = require('../lib/helpers/modifierEngine')

describe('colorSchemeDarkMode modifier helpers', () => {
  it('emits rules for a dark mode modifier registered via registerModifier', () => {
    const globalData = { headRaw: [] }

    registerModifier(globalData, {
      modifier: 'dark',
      mediaQuery: '(prefers-color-scheme: dark)',
      classNamespace: 'dark',
    })

    const className = registerModifierRule(globalData, {
      modifier: 'dark',
      cssProperty: 'background-color',
      cssValue: '#111111',
    })

    const emitted = emitModifierHeadStyle(globalData)

    assert.strictEqual(className, 'mj-dark-1')
    assert.strictEqual(emitted, true)
    assert.strictEqual(globalData.headRaw.length, 1)
    assert.ok(globalData.headRaw[0].includes('@media (prefers-color-scheme: dark)'))
    assert.ok(globalData.headRaw[0].includes('.mj-dark-1 { background-color: #111111 !important; }'))
  })

  it('uses modifier keyword as class namespace when none is provided for dark modifier', () => {
    const globalData = { headRaw: [] }

    const className = registerModifierRule(globalData, {
      modifier: 'dark',
      mediaQuery: '(prefers-color-scheme: dark)',
      cssProperty: 'color',
      cssValue: '#ffffff',
    })

    const emitted = emitModifierHeadStyle(globalData)

    assert.strictEqual(className, 'mj-dark-1')
    assert.strictEqual(emitted, true)
    assert.ok(globalData.headRaw[0].includes('@media (prefers-color-scheme: dark)'))
  })

  it('groups multiple dark mode declarations under one class using registerModifierRuleGroup', () => {
    const globalData = { headRaw: [] }

    registerModifier(globalData, {
      modifier: 'dark',
      mediaQuery: '(prefers-color-scheme: dark)',
      classNamespace: 'dark',
    })

    const className = registerModifierRuleGroup(globalData, {
      modifier: 'dark',
      cssDeclarations: [
        { cssProperty: 'background-color', cssValue: '#111111' },
        { cssProperty: 'color', cssValue: '#ffffff' },
      ],
    })

    const emitted = emitModifierHeadStyle(globalData)

    assert.strictEqual(className, 'mj-dark-1')
    assert.strictEqual(emitted, true)
    assert.ok(globalData.headRaw[0].includes('.mj-dark-1 { background-color: #111111 !important; color: #ffffff !important; }'))
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

    assert.strictEqual(firstEmission, true)
    assert.strictEqual(globalData.headRaw.length, 1)
  })
})
