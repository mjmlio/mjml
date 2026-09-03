const assert = require('assert')

const mjml2html = require('../../mjml/lib')

async function render(mjml) {
  const result = await mjml2html(mjml, { beautify: true })
  return result.html
}

describe('responsive regression coverage', () => {
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

    assert.ok(/\.mj-responsive-1\s+img\s*\{[\s\S]*max-height:\s*200px\s*!important;[\s\S]*min-height:\s*200px\s*!important;[\s\S]*\}/.test(maxOnlyHtml))
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

    assert.ok(/\.mj-responsive-1\s+img\s*\{[\s\S]*height:\s*100px\s*!important;[\s\S]*max-height:\s*200px\s*!important;[\s\S]*\}/.test(withHeightHtml))
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
    const tableMatch = html.match(/<table[^>]*role="none"[^>]*class="([^"]*mj-responsive-\d+[^"]*)"/)
    assert.ok(tableMatch, 'expected responsive class on icon table')

    const iconClass = tableMatch[1].split(/\s+/).find((className) => /^mj-responsive-\d+$/.test(className))
    assert.ok(iconClass, 'expected a plain mj-responsive-* class on icon table')

    assert.ok(html.includes(`.${iconClass},`))
    assert.ok(html.includes(`.${iconClass} td`))
    assert.ok(html.includes(`.${iconClass} img`))
    assert.ok(/<td style="padding:20px;font-size:0;height:60px;background:orange;border-radius:3px;">/.test(html))
  })

  it('mj-table emits stack CSS in a dedicated style tag after responsive/scroll styles', async () => {
    const html = await render(`
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-table responsive-mode="stack" border="1px solid grey" cellpadding="10" container-background-color="lightblue" font-size--responsive="20px" line-height--responsive="30px" width="50%" width--responsive="80%">
                <caption>Caption</caption>
                <tr><th>Year</th><th>Language</th></tr>
                <tr><td>1995</td><td>PHP</td></tr>
              </mj-table>
            </mj-column>
          </mj-section>
          <mj-section>
            <mj-column>
              <mj-table responsive-mode="scroll" border="1px solid grey" cellpadding="10" container-background-color="lightblue" font-size--responsive="20px" line-height--responsive="30px" width="50%" width--responsive="80%">
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
    const stackBlock = styleBlocks.find((block) => /id="mj-stack-table(?:-style)?"/.test(block))
    const scrollBlock = styleBlocks.find((block) => block.includes('.mj-scroll-table-outer'))

    assert.ok(stackBlock, 'expected dedicated stack style block')
    assert.ok(scrollBlock, 'expected scroll style block')
    assert.ok(scrollBlock.includes('.mj-scroll-table-outer'))
    assert.ok(!scrollBlock.includes('.mj-stack-table:is(table) td'))
    assert.ok(stackBlock.includes('.mj-stack-table:is(table) td'))
    assert.ok(!stackBlock.includes('.mj-scroll-table-outer'))
    assert.ok(html.indexOf(scrollBlock) < html.indexOf(stackBlock))
  })
})
