const mjml2html = require('./packages/mjml/lib/index')
const map = require('lodash/map')

const xml = `<mjml>
  <mj-body>
    <mj-container>
      <mj-section background-color="orange">
        <mj-column>
          <mj-social font-size="29px">
            <mj-social-element name="facebook" href="test" />
            <mj-social-element href="http://test" color="blue" font-size="22px" src="icon.png">Touitter</mj-social-element>
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
