var mjml = require('./lib/index')

console.log(
  mjml.mjml2html(`
  <mjml>
    <content>
      <mj-body>
        <mj-navbar base-url="http://google.com/" background-color="#f0f0f0">
          <mj-column width="100%">
            <mj-navbar-link href="#3" color="#42adea" float="left">Order now</mj-navbar-link>
            <mj-navbar-link href="#1" color="#42adea" float="left">Address</mj-navbar-link>
            <mj-navbar-link href="#2" color="#42adea" float="left">Menu</mj-navbar-link>
            <mj-navbar-link href="#3" color="#42adea" float="right">About us</mj-navbar-link>
            <mj-navbar-link href="#3" color="#42adea" float="right">Contact</mj-navbar-link>
          </mj-column>
        </mj-navbar>

        <mj-navbar base-url="http://google.com/" background-color="#f0f0f0">
          <mj-column width="70%" text-align="left">
            <mj-navbar-link href="#1" color="#42adea">Order now</mj-navbar-link>
            <mj-navbar-link href="#2" color="#42adea">Address</mj-navbar-link>
            <mj-navbar-link href="#3" color="#42adea">Menu</mj-navbar-link>
          </mj-column>
          <mj-column width="30%">
            <mj-button href="#4" color="#42adea">About us</mj-button>
          </mj-column>
        </mj-navbar>

      </mj-body>
    </content>
  </mjml>
`, { beautify: true })
)
