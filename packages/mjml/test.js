var mjml = require('./lib/index')
const inputMJML = `
<mjml>
  <mj-head>
    <mj-style inline="inline">
      a { color: blue;}
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-image height="70px" width="463px" src="https://live.ascential.com/sites/default/files/images/logos/ascential-logo-large.png"></mj-image>
          <mj-divider border-color="#2c7b61"></mj-divider>
          <mj-text font-size="35px" color="#2c7b61" font-family="helvetica" align="center" line-height="">
              Your ATR "<%= @atr.title %>" has been approved by the approval chain.{{ test }}
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
            <mj-raw>
            </mj-raw>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`

try {
  const { html, errors } = mjml.mjml2html(inputMJML, { beautify: true, minify: false, level: "soft" })

  if (errors) {
    console.log(errors.map(e => e.formattedMessage).join('\n'))
  }

  console.log(html)
} catch(e) {
  if (e.getMessages) {
  console.log(e.getMessages())
  } else {
    throw e
  }
}
