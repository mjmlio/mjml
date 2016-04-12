var mjml = require('./lib/index')

console.log(
  mjml.mjml2html(`
  <mjml>
    <content>
      <mj-body>
        <mj-navbar>
          <mj-column width="70%">
            <mj-navbar-link href="#">Un lien</mj-navbar-link>
            <mj-navbar-link href="#">Deux liens</mj-navbar-link>
            <mj-navbar-link href="#">Trois liens</mj-navbar-link>
          </mj-column>
          <mj-column width="30%">
          </mj-column>
        </mj-navbar>
      </mj-body>
    </content>
  </mjml>
`, { beautify: true })
)
