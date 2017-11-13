require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml owa_desktop="true">
<mj-body>
<mj-section>
<mj-column>
  <mj-image align="right" alt="The only framework that makes responsive-email easy" container-background-color="#AAA" height="250px" href="http://mjml.io/" src="https://mjml.io/assets/img/responsive.png" width="100%"></mj-image>
</mj-column>
<mj-column>
  <mj-image align="left" alt="The only framework that makes responsive-email easy" container-background-color="#999" height="125px" src="https://mjml.io/assets/img/responsive.png"></mj-image>
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
