var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
  <mjml>
      <mj-body>
          <mj-container background-color="#f0f0f0">
              <mj-section padding="0px" layout="normal" background-color="#ffffff">
                  <mj-column width="50%">
                      <mj-image src="https://ecomail-accounts.s3-eu-west-1.amazonaws.com/jan/2016/Jun/Wed/1466012577." containerWidth="300"></mj-image>
                  </mj-column>
                  <mj-column width="50%">
                      <mj-image src="https://ecomail-accounts.s3-eu-west-1.amazonaws.com/jan/2016/Jun/Wed/1466012577." containerWidth="300"></mj-image>
                  </mj-column>
              </mj-section>
          </mj-container>
      </mj-body>
  </mjml>`, { beautify: true }))
