var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mjml>
    <mj-body>
      <mj-container>
        <mj-section>
          <mj-group>
            <mj-column>
              <mj-image width="137px" height="185px" padding="0" src="https://mjml.io/assets/img/easy-and-quick.png" />
              <mj-text align="center">
                <h2>Easy and quick</h2>
                <p>Write less code, save time and code more efficiently with MJML’s semantic syntax.</p>
              </mj-text>
            </mj-column>
            <mj-column>
              <mj-image width="166px" height="185px" padding="0" src="https://mjml.io/assets/img/responsive.png" />
              <mj-text align="center">
                <h2>Responsive</h2>
                <p>MJML is responsive by design on most-popular email clients, even Outlook.</p>
              </mj-text>
            </mj-column>
          </mj-group>
        </mj-section>
      </mj-container>
    </mj-body>
  </mjml>`, { beautify: true }))
