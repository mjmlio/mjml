const assert = require('assert')

const {
  registerModifier,
  registerModifierRule,
  registerModifierRuleGroup,
  emitModifierHeadStyle,
} = require('../lib/helpers/modifierEngine')
const {
  registerDarkModeRuleGroup,
  registerDarkModeRule,
  registerDarkModeSelectorRule,
  emitDarkModeHeadStyle,
} = require('../lib/helpers/colorSchemeDarkMode')

describe('colorSchemeDarkMode modifier helpers', () => {
  it('maps Outlook dark-mode group support to modifier selectors', () => {
    const globalData = { headRaw: [] }

    const className = registerDarkModeRuleGroup(globalData, {
      cssDeclarations: [
        { cssProperty: 'background-color', cssValue: '#111111' },
        { cssProperty: 'color', cssValue: '#ffffff' },
      ],
      supportOutlookDarkMode: true,
    })
    const emitted = emitDarkModeHeadStyle(globalData)

    assert.strictEqual(className, 'mj-dark-1')
    assert.strictEqual(emitted, true)
    assert.ok(globalData.headRaw[0].includes(
      '[data-ogsb] .mj-dark-1 { background-color: #111111 !important; color: #ffffff !important; }',
    ))
  })

  it('does not emit Outlook dark-mode group rules unless explicitly requested', () => {
    const globalData = { headRaw: [] }

    registerDarkModeRuleGroup(globalData, {
      cssDeclarations: [{ cssProperty: 'color', cssValue: '#ffffff' }],
    })
    emitDarkModeHeadStyle(globalData)

    assert.ok(!globalData.headRaw[0].includes('[data-ogsb]'))
    assert.ok(globalData.headRaw[0].includes('.mj-dark-1 { color: #ffffff !important; }'))
  })

  for (const outlookFirst of [true, false]) {
    it(`preserves Outlook prefixes across mixed dark rules when Outlook registration is ${
      outlookFirst ? 'first' : 'last'
    }`, () => {
      const globalData = { headRaw: [] }

      const registerOutlookGroup = () =>
        registerDarkModeRuleGroup(globalData, {
          cssDeclarations: [
            { cssProperty: 'background-color', cssValue: '#111111' },
          ],
          supportOutlookDarkMode: true,
        })

      const registerOrdinaryRules = () => {
        const groupClass = registerDarkModeRuleGroup(globalData, {
          cssDeclarations: [{ cssProperty: 'color', cssValue: '#ffffff' }],
        })
        const ruleClass = registerDarkModeRule(globalData, {
          cssProperty: 'border-color',
          cssValue: '#222222',
        })
        registerDarkModeSelectorRule(globalData, {
          selector: '.ordinary-selector',
          cssProperty: 'color',
          cssValue: '#333333',
        })

        return { groupClass, ruleClass }
      }

      let outlookClass
      let ordinaryClasses
      if (outlookFirst) {
        outlookClass = registerOutlookGroup()
        ordinaryClasses = registerOrdinaryRules()
      } else {
        ordinaryClasses = registerOrdinaryRules()
        outlookClass = registerOutlookGroup()
      }

      emitDarkModeHeadStyle(globalData)

      const css = globalData.headRaw[0]
      assert.ok(css.includes(
        `[data-ogsb] .${outlookClass} { background-color: #111111 !important; }`,
      ))
      assert.ok(!css.includes(`[data-ogsb] .${ordinaryClasses.groupClass}`))
      assert.ok(!css.includes(`[data-ogsb] .${ordinaryClasses.ruleClass}`))
      assert.ok(!css.includes('[data-ogsb] .ordinary-selector'))
    })
  }

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
