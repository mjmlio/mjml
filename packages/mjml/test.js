var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mjml>
    <mj-body>
      <mj-container>
        <mj-section>
            <mj-column>
              <mj-button background-color="transparent" border="2px solid black" color="black" inner-padding="10px" href="http://mjml.io" border-radius="10px" align="center">
                Check out promotions !
              </mj-button>
            </mj-column>
        </mj-section>
      </mj-container>
    </mj-body>
  </mjml>`, { beautify: true }))
