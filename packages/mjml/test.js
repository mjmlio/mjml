var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mj-body>
    <mj-navbar>
      <mj-column>
        <mj-text>
          Toto
        </mj-text>
      </mj-column>
    </mj-navbar>
  </mj-body>
`, { beautify: true }))
