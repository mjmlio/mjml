require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>

  <mj-head>

  </mj-head>

  <mj-body background-color="#F2F2F2">

      <mj-section padding="10px 0 20px 0">
        <mj-column>
          <mj-text align="center" color="#9B9B9B" font-size="11px"><a href="#" style="color: #9B9B9B;">Unsubscribe</a> from this newsletter<br>52 Edison Court Suite 259 / East Aidabury / Cambodi<br>
            Hello boyz
          </mj-text>
        </mj-column>
      </mj-section>


  </mj-body>
</mjml>`

console.time('mjml2html')

const { html } = mjml2html(xml, {
  beautify: true,
  filePath: './test.mjml'
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
