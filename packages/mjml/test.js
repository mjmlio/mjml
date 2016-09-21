var mjml = require('./lib/index')
try {
const azeaze = console.log(mjml.mjml2html(`
<mjml>
  <mj-body>
    <mj-container>
      <mj-section border="yellow solid 3px">
          <mj-text>zaopae</mj-text>
          <mj-column border="orange solid 3px">
            <mj-text font-family="Raleway, 'Comic Sans MS'" test="test" wow="awesome">
              2 coloumnes $2
            </mj-text>
            <mj-pouet />
          </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>`, { beautify: true }))
} catch(e) {
  if (e.getErrors) {
  console.log(e.getMessages())
  } else {
    throw e
  }
}
