const mjml2html = require('./packages/mjml/lib/index')

const map = require('lodash/map')

const xml = `<mjml>
  <mj-body>
    <mj-section>
      <mj-include path="./column.mjml" />
      <mj-column>
        <mj-text>
          <mj-include path="./text.mjml" />
          Hello don't explode pls :o
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

if (process.argv.includes('--output')) {
  console.log(html)
}


console.timeEnd('mjml2html')
