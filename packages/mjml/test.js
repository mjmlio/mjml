var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
<mjml>
  <mj-body>
    <mj-container mj-class="bg-blue">
      <mj-section>
        <mj-group>
          <mj-column>
            <mj-image src="https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg" />
          </mj-column>
          <mj-column>
            <mj-text>Hello column</mj-text>
          </mj-column>
        </mj-group>
        <mj-column>
          <mj-text>Hello column</mj-text>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`, { beautify: true }))
