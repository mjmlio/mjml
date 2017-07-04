require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>
  <mj-head>
    <mj-style inline="inline">
      p {
        color: red;
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section background-url="http://www.lerepairedessciences.fr/sciences/questions_sciences/nuages_tombent_fichiers/nuages.jpg"  border-top="1px solid #aaaaaa" border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px">
      <mj-column>
        <mj-text>
          <p>
            pouet pouet pouet
          </p>
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
