var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text align="center" />
      <mj-image align="center" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-container background-color="red">
      <mj-section background-color="yellow">
        <mj-group background-color="green">
          <mj-column>
            <mj-image src="https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg" />
          </mj-column>
          <mj-column>
            <mj-text>Hello column</mj-text>
          </mj-column>
        </mj-group>
        <mj-column background-color="orange">
          <mj-text>Hello column</mj-text>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`, { beautify: true }))
