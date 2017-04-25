const mjml2html = require('./packages/mjml/lib/index')
const map = require('lodash/map')

const xml = `<mjml>
  <mj-body>
    <mj-container>
      <mj-section background-color="orange">
        <mj-column>
          <mj-social>
            <mj-social-element />
          </mj-social>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`

console.time('mjml2html')

const { html } = mjml2html(xml, {
  beautify: true
})

if (process.argv.includes('--output')) {
  console.log(html)
}

console.timeEnd('mjml2html')
