var mjml = require('./lib/index')

console.log(
  mjml.mjml2html(`
  <mjml>
    <content>
      <mj-body>
        <mj-navbar base-url="http://google.com/" background-color="red">
          <mj-navbar-column width="70%" text-align="center">
            <mj-navbar-link href="#1" color="#42adea">Un lien</mj-navbar-link>
            <mj-navbar-link href="#2" color="#42adea">Deux liens</mj-navbar-link>
            <mj-navbar-link href="#3" color="#42adea">Trois liens</mj-navbar-link>
            <mj-navbar-link href="#4" color="#42adea">Quatre liens</mj-navbar-link>
            <mj-navbar-link href="#5" color="#42adea">Cinq liens</mj-navbar-link>
          </mj-navbar-column>
        </mj-navbar>
      </mj-body>
    </content>
  </mjml>
`, { beautify: true })
)
