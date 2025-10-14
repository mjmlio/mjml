const chai = require('chai')
const mjml = require('../lib')

describe('HTML comments', function () {
  it('should not alter the whitespace between the opening/closing comment tags and the comment content', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
            <p>View source to see comments below</p>
            <!-- comment with standard spaces -->
            <br>
            <!--comment without spaces-->
            <br>
            <!--     comment with 5 spaces     -->
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = mjml(input)

    // should not alter the whitespace between the opening/closing comment tags and the comment content
    const expected = [
      '<!-- comment with standard spaces -->',
      '<!--comment without spaces-->',
      '<!--     comment with 5 spaces     -->',
    ]
    const indexes = expected.map((str) => html.indexOf(str))

    chai.expect(indexes, 'Cmment syntax unaltered').to.not.include(-1)
  })
})
