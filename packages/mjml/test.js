var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text padding="0" />
      <mj-class name="blue" color="blue" />
      <mj-class name="big" font-size="20px" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-text mj-class="blue big"> Hello World! </mj-text>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`, { beautify: true }))
