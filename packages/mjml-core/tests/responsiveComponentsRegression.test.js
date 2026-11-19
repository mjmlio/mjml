const assert = require('assert')
const { load } = require('cheerio')
const postcss = require('postcss')
const defaultSkeleton = require('../lib/helpers/skeleton')

const mjml2html = require('../../mjml/lib')

async function render(mjml) {
  const result = await mjml2html(mjml, { beautify: true })
  return result.html
}

describe('responsive regression coverage', () => {
  it('does not assume component class targets remain disjoint in a custom skeleton', async () => {
    let called = false
    const { html } = await mjml2html(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-text padding-top--responsive="5px">Top only</mj-text>
        <mj-text padding--responsive="0" padding-top--responsive="5px">Both</mj-text>
      </mj-column></mj-section></mj-body></mjml>
    `, {
      skeleton(options) {
        called = true
        assert.strictEqual(options.modifierUseClassTargets, false)
        return defaultSkeleton(options)
      },
    })

    assert.strictEqual(called, true)
    assert.ok(html.includes('padding-top: 5px !important;'))
  })

  for (const [description, classAttribute] of [
    ['space-separated classes', 'class="mj-responsive-2 mj-responsive-3"'],
    ['entity-encoded whitespace', 'class="mj-responsive-2&#32;mj-responsive-3"'],
    ['uppercase class attribute', 'CLASS="mj-responsive-2 mj-responsive-3"'],
  ]) {
    it(`tracks modifier class overlap in raw markup with ${description}`, async () => {
      const html = await render(`
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text font-size--responsive="14px">First</mj-text>
                <mj-text font-size--responsive="18px">Second</mj-text>
                <mj-text font-size--responsive="14px">Third</mj-text>
                <mj-raw><div ${classAttribute}>Raw</div></mj-raw>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `)
      const $ = load(html)
      const declarations = []

      $('head style').each((index, element) => {
        postcss.parse($(element).text()).walkAtRules('media', (media) => {
          if (!media.params.includes('max-width:479px')) return
          media.walkRules((rule) => {
            if (!rule.selectors.some((selector) =>
              ['.mj-responsive-2', '.mj-responsive-3'].includes(selector),
            )) {
              return
            }
            rule.walkDecls('font-size', (declaration) => {
              declarations.push(declaration.value)
            })
          })
        })
      })

      assert.deepStrictEqual(declarations, ['18px', '14px'])
    })
  }

  it('retains global concatenation across many components with alternating values', async () => {
    const components = Array.from({ length: 30 }, (value, index) => `
      <mj-text padding--responsive="0" padding-top--responsive="5px"
        font-size--responsive="${index % 2 ? '14px' : '18px'}"
        color--dark="${index % 2 ? '#ffffff' : '#eeeeee'}">Card ${index}</mj-text>
    `).join('')
    const html = await render(`
      <mjml support-dark-mode="true"><mj-body><mj-section><mj-column>
        ${components}
      </mj-column></mj-section></mj-body></mjml>
    `)
    const $ = load(html)
    const responsive = []
    const dark = []
    $('head style').each((index, element) => {
      postcss.parse($(element).text()).walkAtRules('media', (media) => {
        if (media.params.includes('max-width:479px')) media.walkRules((rule) => responsive.push(rule))
        if (media.params.includes('prefers-color-scheme: dark')) media.walkRules((rule) => dark.push(rule))
      })
    })

    assert.strictEqual(responsive.length, 3)
    assert.strictEqual(dark.length, 2)
    assert.ok(responsive.some((rule) => rule.selectors.length === 30))
    assert.ok(dark.every((rule) => rule.selectors.length === 15))
  })

  for (const reverse of [false, true]) {
    it(`preserves responsive padding overrides across components in ${reverse ? 'reversed' : 'original'} order`, async () => {
      const components = [
        '<mj-text padding-top--responsive="5px">Top only</mj-text>',
        '<mj-text padding--responsive="0" padding-top--responsive="5px">Shorthand and top</mj-text>',
      ]
      if (reverse) components.reverse()

      const html = await render(`
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>${components.join('')}</mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `)
      const $ = load(html)
      const target = $('td').filter((index, element) =>
        $(element).text().trim() === 'Shorthand and top').first()
      const className = target.attr('class').split(/\s+/)
        .find((value) => value.startsWith('mj-responsive-'))
      assert.ok(className)

      const declarations = []
      $('head style').each((index, element) => {
        postcss.parse($(element).text()).walkAtRules('media', (media) => {
          if (!media.params.includes('max-width:479px')) return
          media.walkRules((rule) => {
            if (!rule.selectors.includes(`.${className}`)) return
            rule.walkDecls(/^padding/, (declaration) => {
              assert.strictEqual(declaration.important, true)
              declarations.push([declaration.prop, declaration.value])
            })
          })
        })
      })

      assert.deepStrictEqual(declarations, [['padding', '0'], ['padding-top', '5px']])
    })
  }

  it('mj-navbar stacks links independently of hamburger support and preserves stack indices', async () => {
    const html = await render(`
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-navbar layout--responsive="stack">
                <mj-navbar-link href="https://example.com/plain">Plain</mj-navbar-link>
              </mj-navbar>
              <mj-navbar layout--responsive="stack" hamburger="hamburger">
                <mj-navbar-link href="https://example.com/stack">Stack</mj-navbar-link>
              </mj-navbar>
              <mj-navbar hamburger="hamburger">
                <mj-navbar-link href="https://example.com/inline">Inline</mj-navbar-link>
              </mj-navbar>
              <mj-navbar layout--responsive="stack">
                <mj-navbar-link href="https://example.com/plain-after">Plain after</mj-navbar-link>
              </mj-navbar>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `)

    assert.ok(/<div[^>]*class="mj-inline-links mj-inline-links-1"/.test(html))
    assert.strictEqual(
      (html.match(/<div[^>]*class="mj-inline-links mj-inline-links-2"/g) || [])
        .length,
      1,
    )
    assert.strictEqual(
      (html.match(/<div[^>]*class="mj-inline-links"/g) || []).length,
      1,
    )
    assert.ok(
      /@media only screen and \(max-width:479px\)\s*\{\s*\.mj-inline-links-1 \.mj-link,\s*\.mj-inline-links-2 \.mj-link,\s*\.mj-inline-links-3 \.mj-link\s*\{\s*display: block !important\s*\}/.test(
        html,
      ),
    )
    assert.ok(/<div[^>]*class="mj-inline-links mj-inline-links-3"/.test(html))
    assert.ok(!html.includes('mj-inline-links-4'))
    assert.strictEqual((html.match(/<input\b/g) || []).length, 2)
    assert.ok(
      /\.mj-menu-checkbox\[type="checkbox"\]\s*~\s*\.mj-inline-links/.test(
        html,
      ),
    )
  })

  for (const mode of ['fixed-height', 'fluid-height']) {
    for (const [dimensions, modifiers, expectedSize] of [
      [
        'background-width="600px" background-height="100px"',
        'background-width--responsive="400px" background-height--responsive="200px"',
        '400px 200px',
      ],
      [
        'background-width="600px" background-height="100px"',
        'background-width--responsive="400px"',
        '400px 100px',
      ],
      [
        'background-width="600px" background-height="100px"',
        'background-height--responsive="200px"',
        '600px 200px',
      ],
      ['', 'background-width--responsive="80%"', '80% auto'],
      ['', 'background-height--responsive="200px"', 'auto 200px'],
      ['background-width="600px" background-height="100px"', '', null],
    ]) {
      it(`mj-hero applies ${expectedSize || 'default'} background dimensions in ${mode} mode with ${modifiers || 'no modifiers'}`, async () => {
        const html = await render(`
          <mjml>
            <mj-body>
              <mj-hero mode="${mode}" height="100px" ${dimensions} ${modifiers} background-url="https://example.com/hero.png">
                <mj-text>Hero</mj-text>
              </mj-hero>
            </mj-body>
          </mjml>
        `)

        assert.ok(html.includes('background-size:cover;'))
        if (expectedSize) {
          assert.ok(
            html.includes(`background-size: ${expectedSize} !important;`),
          )
          assert.ok(
            /<td[^>]*class="mj-responsive-1"[^>]*style="[^"]*background-size:cover;/.test(
              html,
            ),
          )
        } else {
          assert.ok(!/background-size:[^;]*!important/.test(html))
        }
        if (mode === 'fluid-height' && expectedSize === '400px 200px') {
          assert.ok(html.includes('padding-bottom: 50% !important;'))
        }
      })
    }
  }

  it('mj-image emits min-height only when max-height--responsive is set without height--responsive and keeps class on td', async () => {
    const maxOnlyHtml = await render(`
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image src="https://email-placeholders.com/100x400/ffffff/cc0000?text=Light" width="100px" max-height--responsive="200px" />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `)

    assert.ok(
      /\.mj-responsive-1\s+img\s*\{[\s\S]*max-height:\s*200px\s*!important;[\s\S]*min-height:\s*200px\s*!important;[\s\S]*\}/.test(
        maxOnlyHtml,
      ),
    )
    assert.ok(/<td[^>]*class="mj-responsive-1"/.test(maxOnlyHtml))
    assert.ok(!/<a\b/.test(maxOnlyHtml))

    const withHeightHtml = await render(`
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image src="https://email-placeholders.com/100x400/ffffff/cc0000?text=Light" width="100px" height--responsive="100px" max-height--responsive="200px" />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `)

    assert.ok(
      /\.mj-responsive-1\s+img\s*\{[\s\S]*height:\s*100px\s*!important;[\s\S]*max-height:\s*200px\s*!important;[\s\S]*\}/.test(
        withHeightHtml,
      ),
    )
    assert.ok(!withHeightHtml.includes('min-height: 200px !important;'))
  })

  it('mj-social uses one icon responsive class on table and targets table/td/img selectors from it', async () => {
    const html = await render(`
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-social mode="horizontal" icon-size="60px" icon-size--responsive="30px" icon-height="60px" icon-height--responsive="30px" icon-padding="20px">
                <mj-social-element name="facebook" background-color="orange" href="https://mjml.io/">Facebook</mj-social-element>
              </mj-social>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `)

    // background/border-radius moved to icon <td>; table now carries only the responsive class
    const tableMatch = html.match(
      /<table[^>]*role="none"[^>]*class="([^"]*mj-responsive-\d+[^"]*)"/,
    )
    assert.ok(tableMatch, 'expected responsive class on icon table')

    const iconClass = tableMatch[1]
      .split(/\s+/)
      .find((className) => /^mj-responsive-\d+$/.test(className))
    assert.ok(iconClass, 'expected a plain mj-responsive-* class on icon table')

    assert.ok(html.includes(`.${iconClass},`))
    assert.ok(html.includes(`.${iconClass} td`))
    assert.ok(html.includes(`.${iconClass} img`))
    assert.ok(
      /<td style="padding:20px;font-size:0;height:60px;background:orange;border-radius:3px;">/.test(
        html,
      ),
    )
  })

  it('mj-table emits stack CSS in a dedicated style tag after responsive/scroll styles', async () => {
    const html = await render(`
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-table layout--responsive="stack" border="1px solid grey" cellpadding="10" container-background-color="lightblue" font-size--responsive="20px" line-height--responsive="30px" width="50%" width--responsive="80%">
                <caption>Caption</caption>
                <tr><th>Year</th><th>Language</th></tr>
                <tr><td>1995</td><td>PHP</td></tr>
              </mj-table>
            </mj-column>
          </mj-section>
          <mj-section>
            <mj-column>
              <mj-table layout--responsive="scroll" border="1px solid grey" cellpadding="10" container-background-color="lightblue" font-size--responsive="20px" line-height--responsive="30px" width="50%" width--responsive="80%">
                <caption>Caption</caption>
                <tr><th>Year</th><th>Language</th><th>Inspired from</th></tr>
                <tr><td>1995</td><td>PHP</td><td>C, Shell Unix</td></tr>
              </mj-table>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `)

    const styleBlocks = html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []
    const stackBlock = styleBlocks.find((block) =>
      /id="mj-stack-table(?:-style)?"/.test(block),
    )
    const scrollBlock = styleBlocks.find((block) =>
      block.includes('.mj-scroll-table-outer'),
    )

    assert.ok(stackBlock, 'expected dedicated stack style block')
    assert.ok(scrollBlock, 'expected scroll style block')
    assert.ok(scrollBlock.includes('.mj-scroll-table-outer'))
    assert.ok(!scrollBlock.includes('.mj-stack-table:is(table) td'))
    assert.ok(stackBlock.includes('.mj-stack-table:is(table) td'))
    assert.ok(!stackBlock.includes('.mj-scroll-table-outer'))
    assert.ok(html.indexOf(scrollBlock) < html.indexOf(stackBlock))
  })
})
