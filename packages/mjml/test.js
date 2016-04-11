var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mj-body>
    <mj-navbar>
      test test
    </mj-navbar>
  </mj-body>
`, { beautify: true }))
