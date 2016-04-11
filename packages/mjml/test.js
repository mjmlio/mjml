var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mjml>
    <content>
      <mj-body background-color="#d6dde5">
        <mj-navbar>
          <mj-column width="100%" vertical-align="middle">
              <a href="###" target="_blank" style="display:inline-block; padding:15px 10px; color:#42adea; font:12px/1.25 Avenir, sans-serif; letter-spacing:0.2em; text-transform:uppercase; text-decoration:none;">Order now</a>
              <a href="###" target="_blank" style="display:inline-block; padding:15px 10px; color:#42adea; font:12px/1.25 Avenir, sans-serif; letter-spacing:0.2em; text-transform:uppercase; text-decoration:none;">Addresses</a>
              <a href="###" target="_blank" style="display:inline-block; padding:15px 10px; color:#42adea; font:12px/1.25 Avenir, sans-serif; letter-spacing:0.2em; text-transform:uppercase; text-decoration:none;">Menu</a>
          </mj-column>
        </mj-navbar>
    </mj-body>

    </content>
  </mjml>
`, { beautify: true }))
