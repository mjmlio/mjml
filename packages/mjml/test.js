var mjml = require('./lib/index')
const inputMJML = `
<mjml>
  <mj-head>
    <mj-preview>Hey im the preview</mj-preview>
  </mj-head>
  <mj-body>
    <mj-container background-color="#ccccdd">

      <!-- Start of button -->
      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="white" background-color="#f45e43" font-style="italic">
            Background-color & font-size
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="white" background-color="#f45e43" border-radius="50px">
            border-radius
          </mj-button>
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
