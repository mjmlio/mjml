require('@babel/register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>
    <mj-head>
        <mj-attributes>
          <mj-all font-family="'Source Sans 3', Arial, sans-serif" font-size="16px" line-height="1.4" color="#0f3549" />
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

async function run() {
  console.time('mjml2html')
  const { html } = await mjml2html(xml, {
    minify: true,
    beautify: false,
  })

  console.log(html)

  console.timeEnd('mjml2html')

  if (process.argv.includes('--open')) {
    const open = require('open')
    const path = require('path')
    const fs = require('fs')

    const testFile = path.resolve(__dirname, './test.html')

    fs.writeFileSync(testFile, html)

    open(testFile)
  }
}

run()
