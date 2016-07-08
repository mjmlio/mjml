var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mjml>
      <mj-body>
          <mj-container background-color="#f0f0f0">
            <mj-section>
              <mj-column>
                <mj-section></mj-section>
              </mj-column>
            </mj-section>
          </mj-container>
      </mj-body>
  </mjml>`, { beautify: true }))
