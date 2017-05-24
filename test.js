const mjml2html = require('./packages/mjml/lib/index')
const map = require('lodash/map')

const xml = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text color="blue" />
      <mj-class name="try" color="violet" />
    </mj-attributes>
  </mj-head>
  <mj-body>
      <mj-text> Blue? </mj-text>
      <mj-text mj-class="try"> violet</mj-text>
      <mj-test />
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
