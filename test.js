require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-image width="100" src="/assets/img/logo-small.png"></mj-image>

        <mj-divider border-color="#F45E43"></mj-divider>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>

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
