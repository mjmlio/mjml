require('babel-register')

var mjml = require('./src/index')

console.log(mjml.mjml2html(`
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-raw>
          <td><% if (undefined) {} %></td>
        </mj-raw>
      </mj-column>
    </mj-section>
  </mj-body>
`, { beautify: true }))
