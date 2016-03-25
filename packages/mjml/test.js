var mjml = require('./lib/index')

console.log(new mjml.MJMLRenderer(`
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-raw>
          <td><% if (undefined) {} %></td>
        </mj-raw>
      </mj-column>
    </mj-section>
  </mj-body>
`, { beautify: true }).render())
