const chai = require('chai')
require('mjml')
const { components } = require('mjml-core')

const MJMLParser = require('../lib')

const parse = (mjml) =>
  MJMLParser(mjml, {
    keepComments: true,
    components,
    filePath: '.',
    ignoreIncludes: false,
  })

const collectLines = (node) => [
  { tagName: node.tagName, line: node.line, content: node.content },
  ...(node.children || []).flatMap(collectLines),
]

describe('mjml-parser-xml line numbers', () => {
  it('reports the source line of each tag and comment', () => {
    // mj-column starts at column 0, so its start index equals a line start index
    const xml = `<mjml><!-- first line -->
  <mj-body>


    <mj-section>
<mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
    <!-- near end of file -->
  </mj-body>
</mjml>`

    chai.expect(collectLines(parse(xml))).to.deep.equal([
      { tagName: 'mjml', line: 1, content: undefined },
      { tagName: 'mj-raw', line: 1, content: '<!-- first line -->' },
      { tagName: 'mj-body', line: 2, content: undefined },
      { tagName: 'mj-section', line: 5, content: undefined },
      { tagName: 'mj-column', line: 6, content: undefined },
      { tagName: 'mj-text', line: 7, content: 'Hello' },
      { tagName: 'mj-raw', line: 10, content: '<!-- near end of file -->' },
    ])
  })
})
