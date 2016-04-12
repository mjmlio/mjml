var mjml = require('./lib/index')

console.log(
  mjml.mjml2html(`
  <mjml>
    <content>
      <mj-body>
        <mj-navbar base-url="http://google.com/">
          <mj-column width="70%">
            <mj-navbar-link href="#1">Un lien</mj-navbar-link>
            <mj-navbar-link href="#2">Deux liens</mj-navbar-link>
            <mj-navbar-link href="#3">Trois liens</mj-navbar-link>
          </mj-column>
        </mj-navbar>
      </mj-body>
    </content>
  </mjml>
`, { beautify: true })
)
