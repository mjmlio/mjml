const assert = require('assert')
const postcss = require('postcss')
const {
  formatGroupedRules,
  registerModifierClassTargets,
} = require('../lib/helpers/modifierEngine')

describe('modifier rule grouping', () => {
  for (const reverse of [false, true]) {
    for (const [shorthand, longhand, baseValue, overrideValue] of [
      ['padding', 'padding-top', '0', '5px'],
      ['background-position', 'background-position-x', 'center', 'left'],
      ['border-color', 'border-top-color', 'black', 'red'],
      ['margin', 'margin-top', '0', '5px'],
    ]) {
      it(`preserves ${shorthand} overrides with ${reverse ? 'reversed' : 'original'} registration order`, () => {
        const groups = [
          [{ className: 'a', cssProperty: longhand, cssValue: overrideValue }],
          [
            { className: 'b', cssProperty: shorthand, cssValue: baseValue },
            { className: 'b', cssProperty: longhand, cssValue: overrideValue },
          ],
        ]
        if (reverse) groups.reverse()

        const css = formatGroupedRules(groups.flat())
        const selectors = reverse ? '.b,\n  .a' : '.a,\n  .b'
        const expected = `  .b { ${shorthand}: ${baseValue} !important; }\n` +
          `  ${selectors} { ${longhand}: ${overrideValue} !important; }`

        assert.strictEqual(css, expected)
      })
    }
  }

  it('retains the final repeated declaration on overlapping selectors', () => {
    const css = formatGroupedRules([
      { selector: '.a', cssProperty: 'color', cssValue: 'red' },
      { selector: '.b', cssProperty: 'color', cssValue: 'blue' },
      { selector: '.a', cssProperty: 'color', cssValue: 'red' },
    ])

    assert.strictEqual(css, [
      '  .b { color: blue !important; }',
      '  .a { color: red !important; }',
    ].join('\n'))
  })

  it('concatenates non-adjacent independent declarations globally', () => {
    const css = formatGroupedRules([
      { className: 'a', cssProperty: 'color', cssValue: 'red' },
      { className: 'a', cssProperty: 'font-size', cssValue: '14px' },
      { className: 'b', cssProperty: 'color', cssValue: 'red' },
      { className: 'b', cssProperty: 'font-size', cssValue: '14px' },
    ])

    assert.strictEqual(css, '  .a,\n  .b { color: red !important; font-size: 14px !important; }')
  })

  it('splits contradictory shorthand ordering while retaining independent concatenation', () => {
    const css = formatGroupedRules([
      { className: 'a', cssProperty: 'padding', cssValue: '0' },
      { className: 'a', cssProperty: 'padding-top', cssValue: '5px' },
      { className: 'a', cssProperty: 'color', cssValue: 'red' },
      { className: 'b', cssProperty: 'padding-top', cssValue: '5px' },
      { className: 'b', cssProperty: 'padding', cssValue: '0' },
      { className: 'b', cssProperty: 'color', cssValue: 'red' },
    ])

    assert.ok(css.includes('.a,\n  .b { padding-top: 5px !important; color: red !important; }'), css)
    assert.ok(css.indexOf('.a { padding: 0') < css.indexOf('padding-top: 5px'), css)
    assert.ok(css.indexOf('padding-top: 5px') < css.indexOf('.b { padding: 0'), css)
  })

  it('preserves order when different classes with conflicting values coexist', () => {
    const css = formatGroupedRules([
      { className: 'a', cssProperty: 'color', cssValue: 'red' },
      { className: 'b', cssProperty: 'color', cssValue: 'blue' },
      { className: 'c', cssProperty: 'color', cssValue: 'red' },
    ])

    assert.strictEqual(css, [
      '  .a { color: red !important; }',
      '  .b { color: blue !important; }',
      '  .c { color: red !important; }',
    ].join('\n'))
  })

  it('groups adjacent identical declarations and deduplicates selectors', () => {
    const css = formatGroupedRules([
      { className: 'a', cssProperty: 'color', cssValue: 'red' },
      { className: 'b', cssProperty: 'color', cssValue: 'red' },
      { className: 'a', cssProperty: 'color', cssValue: 'red' },
    ])

    assert.strictEqual(css, '  .a,\n  .b { color: red !important; }')
  })

  it('preserves selector prefixes, suffix arrays and explicit selectors', () => {
    const css = formatGroupedRules([
      {
        className: 'a',
        selectorSuffix: ['', ' img', ' img'],
        cssProperty: 'padding',
        cssValue: '0',
      },
      { selector: '.a img', cssProperty: 'padding-top', cssValue: '5px' },
    ], '[data-ogsb] ')

    assert.strictEqual(css, [
      '  [data-ogsb] .a,\n  [data-ogsb] .a img { padding: 0 !important; }',
      '  [data-ogsb] .a img { padding-top: 5px !important; }',
    ].join('\n'))
  })

  it('retains compact output for many identical multi-declaration components', () => {
    const rules = Array.from({ length: 30 }, (value, index) => [
      { className: `card-${index}`, cssProperty: 'padding', cssValue: '0' },
      { className: `card-${index}`, cssProperty: 'padding-top', cssValue: '5px' },
      { className: `card-${index}`, cssProperty: 'font-size', cssValue: '14px' },
      { className: `card-${index}`, cssProperty: 'color', cssValue: 'red' },
    ]).flat()
    const root = postcss.parse(formatGroupedRules(rules))

    assert.strictEqual(root.nodes.length, 1)
    assert.strictEqual(root.first.selectors.length, 30)
    assert.strictEqual(root.first.nodes.length, 4)
  })

  it('preserves background-position axis overrides', () => {
    const css = formatGroupedRules([
      { className: 'a', cssProperty: 'background-position-y', cssValue: 'top' },
      { className: 'b', cssProperty: 'background-position', cssValue: 'center' },
      { className: 'b', cssProperty: 'background-position-y', cssValue: 'top' },
    ])

    assert.strictEqual(css, [
      '  .b { background-position: center !important; }',
      '  .a,\n  .b { background-position-y: top !important; }',
    ].join('\n'))
  })

  it('handles empty rules and empty suffix lists', () => {
    assert.strictEqual(formatGroupedRules([]), '')
    assert.strictEqual(formatGroupedRules([
      { className: 'a', selectorSuffix: [], cssProperty: 'color', cssValue: 'red' },
    ]), '')
  })

  it('concatenates conflicting values on separately registered class targets', () => {
    const globalData = {}
    for (const className of ['a', 'b', 'c']) registerModifierClassTargets(globalData, className)
    const css = formatGroupedRules([
      { className: 'a', cssProperty: 'color', cssValue: 'red' },
      { className: 'b', cssProperty: 'color', cssValue: 'blue' },
      { className: 'c', cssProperty: 'color', cssValue: 'red' },
    ], '', globalData.modifierClassTargets)

    assert.strictEqual(css, [
      '  .a,\n  .c { color: red !important; }',
      '  .b { color: blue !important; }',
    ].join('\n'))
  })

  it('does not assume separate generated classes are disjoint when they coexist', () => {
    const globalData = {}
    registerModifierClassTargets(globalData, 'a b')
    registerModifierClassTargets(globalData, 'b c')
    const css = formatGroupedRules([
      { className: 'a', cssProperty: 'color', cssValue: 'red' },
      { className: 'b', cssProperty: 'color', cssValue: 'blue' },
      { className: 'c', cssProperty: 'color', cssValue: 'red' },
    ], '', globalData.modifierClassTargets)

    assert.strictEqual(css, [
      '  .a { color: red !important; }',
      '  .b { color: blue !important; }',
      '  .c { color: red !important; }',
    ].join('\n'))
  })

  it('retains conservative ordering for explicit selectors even with known class targets', () => {
    const globalData = {}
    registerModifierClassTargets(globalData, 'a')
    registerModifierClassTargets(globalData, 'b')
    registerModifierClassTargets(globalData, 'c')
    const css = formatGroupedRules([
      { selector: '.a:hover', cssProperty: 'color', cssValue: 'red' },
      { selector: '.b:hover', cssProperty: 'color', cssValue: 'blue' },
      { selector: '.c:hover', cssProperty: 'color', cssValue: 'red' },
    ], '', globalData.modifierClassTargets)

    assert.strictEqual(css, [
      '  .a:hover { color: red !important; }',
      '  .b:hover { color: blue !important; }',
      '  .c:hover { color: red !important; }',
    ].join('\n'))
  })

  it('preserves custom-property ordering without expanding the built-in property map', () => {
    const css = formatGroupedRules([
      { selector: '.a', cssProperty: 'font', cssValue: '16px sans-serif' },
      { selector: '.a', cssProperty: 'line-height', cssValue: '20px' },
      { selector: '.b', cssProperty: 'line-height', cssValue: '20px' },
      { selector: '.b', cssProperty: 'font', cssValue: '16px sans-serif' },
    ])
    const root = postcss.parse(css)
    const properties = (selector) => root.nodes.filter((rule) => rule.selectors.includes(selector))
      .flatMap((rule) => rule.nodes.map((declaration) => declaration.prop))

    assert.deepStrictEqual(properties('.a'), ['font', 'line-height'])
    assert.deepStrictEqual(properties('.b'), ['line-height', 'font'])
  })

  it('ignores empty class lists and records whitespace-separated classes once per target', () => {
    const globalData = {}
    registerModifierClassTargets(globalData, undefined)
    registerModifierClassTargets(globalData, ' \n ')
    assert.strictEqual(globalData.modifierClassTargets, undefined)
    registerModifierClassTargets(globalData, 'a \n b a')
    assert.strictEqual(globalData.modifierClassTargets.size, 2)
    assert.strictEqual(globalData.modifierClassTargets.get('a').size, 1)
    assert.deepStrictEqual(globalData.modifierClassTargets.get('a'), globalData.modifierClassTargets.get('b'))
  })

  it('retains conservative ordering for descendant suffixes and unrecorded classes', () => {
    for (const selectorSuffix of ['', ' img']) {
      const globalData = {}
      registerModifierClassTargets(globalData, 'b')
      if (selectorSuffix) registerModifierClassTargets(globalData, 'a')
      const css = formatGroupedRules([
        { className: 'a', selectorSuffix, cssProperty: 'color', cssValue: 'red' },
        { className: 'b', selectorSuffix, cssProperty: 'color', cssValue: 'blue' },
        { className: 'c', selectorSuffix, cssProperty: 'color', cssValue: 'red' },
      ], '', globalData.modifierClassTargets)

      assert.strictEqual(css, [
        `  .a${selectorSuffix} { color: red !important; }`,
        `  .b${selectorSuffix} { color: blue !important; }`,
        `  .c${selectorSuffix} { color: red !important; }`,
      ].join('\n'))
    }
  })

  it('preserves effective declarations for all class combinations across varied rule sequences', () => {
    const footprints = {
      padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
      'border-color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
      'background-position': ['background-position-x', 'background-position-y'],
      margin: ['margin-top'],
    }
    const declarations = [
      ['padding', '0'], ['padding-top', '5px'], ['padding-top', '7px'],
      ['padding-bottom', '9px'], ['margin', '0'], ['margin-top', '5px'],
      ['font-size', '14px'], ['line-height', '20px'],
      ['color', 'red'], ['color', 'blue'], ['background-position', 'center'],
      ['background-position-x', 'left'], ['border-color', 'black'], ['border-top-color', 'red'],
    ]
    let seed = 12345
    const random = (length) => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed % length
    }
    const apply = (state, property, value) => {
      (footprints[property] || [property]).forEach((longhand) => {
        state[longhand] = `${property}: ${value}`
      })
    }

    for (let sample = 0; sample < 80; sample += 1) {
      const rules = Array.from({ length: 18 }, () => {
        const [cssProperty, cssValue] = declarations[random(declarations.length)]
        return { className: ['a', 'b', 'c'][random(3)], cssProperty, cssValue }
      })
      const css = formatGroupedRules(rules)
      const root = postcss.parse(css)

      for (let mask = 1; mask < 8; mask += 1) {
        const classMask = mask
        const classes = ['a', 'b', 'c'].filter((value, index) =>
          Math.floor(classMask / (2 ** index)) % 2 === 1)
        const original = {}
        const grouped = {}
        rules.forEach(({ className, cssProperty, cssValue }) => {
          if (classes.includes(className)) apply(original, cssProperty, cssValue)
        })
        root.walkRules((rule) => {
          if (!rule.selectors.some((selector) => classes.includes(selector.slice(1)))) return
          rule.walkDecls((declaration) => apply(grouped, declaration.prop, declaration.value))
        })

        assert.deepStrictEqual(grouped, original, JSON.stringify({ sample, classes, rules, css }))
      }
    }
  })
})
