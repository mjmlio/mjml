require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-class name="such-class">
        <mj-text color="idkwhatcoloristhis" />
        <mj-divider width="300px" />
      </mj-class>
      <mj-class name="many-class">
        <mj-divider width="50%" />
      </mj-class>
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-section mj-class="such-class many-class">
      <mj-column>
        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
        <mj-divider border-color="#F45E43" />
        <mj-text font-size="20px" font-family="helvetica">Hello World idk</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

console.time('mjml2html')

const { html } = mjml2html(xml, {
  beautify: true,
  filePath: './test.mjml',
})

console.timeEnd('mjml2html')

if (process.argv.includes('--output')) {
  console.log(html)
}

if (process.argv.includes('--open')) {
  const opn = require('opn')
  const path = require('path')
  const fs = require('fs')

  const testFile = path.resolve(__dirname, './test.html')

  fs.writeFileSync(testFile, html)

  opn(testFile, {
    wait: false,
  })
}
