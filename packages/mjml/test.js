var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
<mjml>
  <mj-head>
    <mj-style>
      .testage {
        color: red;
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-text><p class="testage">Hello Peepz</p></mj-text>
  </mj-body>
</mjml>`, { beautify: true }))
