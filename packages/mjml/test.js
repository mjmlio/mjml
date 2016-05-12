var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text color="red" />
      <mj-class name="blue" color="blue" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-text> Hello World! </mj-text>
  </mj-body>
</mjml>
`, { beautify: true }))
