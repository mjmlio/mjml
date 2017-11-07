require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml owa_desktop="true">
<mj-body>
<mj-hero
mode="fluid-height"
background-width="600px"
background-height="469px"
background-url="https://cloud.githubusercontent.com/assets/1830348/15354890/1442159a-1cf0-11e6-92b1-b861dadf1750.jpg"
background-color="#2a3448"
padding="100px 0px">
<!-- To add content like mj-image, mj-text, mj-button ... use the mj-hero-content component -->
  <mj-text
  padding="20px"
  color="#ffffff"
  font-family="Helvetica"
  align="center"
  font-size="45px"
  line-height="45px"
  font-weight="900">
    GO TO SPACE
  </mj-text>
  <mj-button href="https://mjml.io/" align="center">
    ORDER YOUR TICKET NOW
  </mj-button>
</mj-hero>
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
