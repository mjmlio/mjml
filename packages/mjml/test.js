var mjml = require('./lib/index')

console.log(
  mjml.mjml2html(`
  <mjml>
    <content>
      <mj-body>
        <mj-navbar base-url="http://google.com/" background-color="#f0f0f0">
          <mj-navbar-column width="70%" text-align="left">
            <mj-navbar-link href="#1" color="#42adea">Un lien</mj-navbar-link>
            <mj-navbar-link href="#2" color="#42adea">Deux liens</mj-navbar-link>
            <mj-navbar-link href="#3" color="#42adea">Trois liens</mj-navbar-link>
          </mj-navbar-column>
          <mj-navbar-column width="30%">
            <mj-navbar-link href="#4" color="#42adea">Quatre liens</mj-navbar-link>
            <mj-navbar-link href="#5" color="#42adea">(+)</mj-navbar-link>
          </mj-navbar>
        </mj-navbar>

        <mj-navbar base-url="http://google.com/" background-color="#f0f0f0">
          <mj-navbar-column width="70%" text-align="left">
            <mj-navbar-link href="#1" color="#42adea">Un lien</mj-navbar-link>
            <mj-navbar-link href="#2" color="#42adea">Deux liens</mj-navbar-link>
            <mj-navbar-link href="#3" color="#42adea">Trois liens</mj-navbar-link>
          </mj-navbar-column>
          <mj-navbar-column width="30%">
            <mj-button>Un button</mj-button>
          </mj-navbar>
        </mj-navbar>
      </mj-body>
    </content>
  </mjml>
`, { beautify: true })
)
