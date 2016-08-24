var mjml = require('./lib/index')
try {
const azeaze = console.log(mjml.mjml2html(`
<mjml>
  <mj-body>
    <mj-container>
      <mj-section border="yellow solid 3px">
          <mj-column border="orange solid 3px">
            <mj-text font-family="Raleway, 'Comic Sans MS'">
              2 coloumnes $2
            </mj-text>
          </mj-column>
          <mj-column border="green solid 3px">
            <mj-button
              background-color="blue"
              border="2px solid white"
              color="white"
              text-transform="uppercase"
              inner-padding="10px"
              href="http://mjml.io" border-radius="10px"
              align="center">
              Check out promotions !
            </mj-button>
            <mj-text font-family="Raleway, 'Comic Sans MS'">
              foo © bar ≠ baz 𝌆 qux
            </mj-text>
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
