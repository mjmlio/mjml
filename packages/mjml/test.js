var mjml = require('./lib/index')

console.log(
  mjml.mjml2html(`
  <mjml>
    <content>
      <mj-body>
        <mj-navbar base-url="http://google.com/">
          <mj-navbar-column width="70%" text-align="center">
            <mj-navbar-link href="#1">Un lien</mj-navbar-link>
            <mj-navbar-link href="#2">Deux liens</mj-navbar-link>
            <mj-navbar-link href="#3">Trois liens</mj-navbar-link>
          </mj-navbar-column>
        </mj-navbar>
      </mj-body>
    </content>
  </mjml>
`, { beautify: true })
)
