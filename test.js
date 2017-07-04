require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>
  <mj-body>
    <mj-section background-url="http://www.lerepairedessciences.fr/sciences/questions_sciences/nuages_tombent_fichiers/nuages.jpg"  border-top="1px solid #aaaaaa" border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px">
      <mj-column>
        <mj-image padding="0" src="https://placeholdit.imgix.net/~text?&w=350&h=150" />
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
