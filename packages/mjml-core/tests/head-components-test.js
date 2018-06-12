const chai = require('chai')
const mjml = require('mjml')

const testValues = [
  {
    test: 'mj-attributes',
    input: `<mjml>
      <mj-head>
        <mj-attributes>
          <mj-class name="blue" color="blue" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text mj-class="blue" font-size="20px">Hello World</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
`,
    output: `<td\n                 align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"\n              >\n                \n      <div\n         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;line-height:1;text-align:left;color:blue;"\n      >\n        Hello World\n      </div>\n    \n              </td>`,
  },
  {
    test: 'mj-style inline',
    input: `<mjml>
      <mj-head>
        <mj-style inline="inline">
          .link-nostyle {
            color: red;
          }
        </mj-style>
      </mj-head>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              Hello <a href="https://mjml.io" class="link-nostyle">World</a>
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`,
    output: `<a href="https://mjml.io" class="link-nostyle" style="color: red;">World</a>`,
  },
  {
    test: 'mj-style',
    input: `<mjml>
      <mj-head>
        <mj-style>
          .link-nostyle {
            color: red;
          }
        </mj-style>
      </mj-head>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              Hello <a href="https://mjml.io" class="link-nostyle">World</a>
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`,
    output: `<style type="text/css">.link-nostyle {\n            color: red;\n          }</style>`,
  },
]

testValues.forEach(testUnit => {
  const { input, output, test } = testUnit

  chai.expect(mjml(input).html, `${test} test failed`)
      .to.include(output)
})
