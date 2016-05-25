var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mjml>
    <mj-body>
      <mj-container>
        <mj-section>
          <mj-group>
            <mj-column padding="5px">
              <mj-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat varius lacus quis ornare. Mauris elit est, finibus eget lectus a, semper dignissim tortor. Curabitur eget arcu lacinia metus.
              </mj-text>
              <mj-button href="http://mjml.io" background-color="#92F587" color="white">Subscribe now!</mj-button>
            </mj-column>
            <mj-column padding="5px">
              <mj-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat varius lacus quis ornare. Mauris elit est, finibus eget lectus a, semper dignissim tortor. Curabitur eget arcu lacinia metus.
              </mj-text>
              <mj-button href="http://mjml.io" background-color="#92F587" color="white">Subscribe now!</mj-button>
            </mj-column>
          </mj-group>
        </mj-section>
      </mj-container>
    </mj-body>
  </mjml>`, { beautify: true }))
