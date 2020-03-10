require('@babel/register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>
    <mj-head>
        <mj-attributes>
            <mj-all
                padding="0px"
            />
            <mj-wrapper
                background-color="yellow"
                padding="80px"
            />
        </mj-attributes>
    </mj-head>
    <mj-body>
        <mj-wrapper>
            <mj-section>
                <mj-column>
                    <mj-text>
                        lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                    </mj-text>
                </mj-column>
            </mj-section>
        </mj-wrapper>
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
