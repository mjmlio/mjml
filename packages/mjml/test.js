var mjml = require('./lib/index')

console.log(
  mjml.mjml2html(`
  <mjml>
    <content>
      <mj-body>
        <mj-navbar background-color="#f0f0f0">
          <mj-column width="100%">
            <mj-inline-links base-url="http://google.com/">
              <mj-link href="#3" color="#42adea">Order now</mj-link>
              <mj-link href="#1" color="#42adea">Address</mj-link>
              <mj-link href="#2" color="#42adea">Menu</mj-link>
            </mj-inline-links>
          </mj-column>
        </mj-navbar>

        <mj-navbar background-color="#f0f0f0">
          <mj-column width="70%" text-align="left">
            <mj-inline-links base-url="http://google.com/">
              <mj-link href="#1" color="#42adea">Order now</mj-link>
              <mj-link href="#2" color="#42adea">Address</mj-link>
              <mj-link href="#3" color="#42adea">Menu</mj-link>
            </mj-inline-links>
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
