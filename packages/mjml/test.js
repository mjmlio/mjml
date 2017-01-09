var mjml = require('./lib/index')
const inputMJML = `<mjml>
  <mj-body>
    <mj-container background-color="#d6dde5">
      <mj-wrapper background-color="red" full-width="full-width">
        <mj-section background-color="white">
          <mj-column>
            <mj-text>Hello worldo</mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="blue">
          <mj-column>
            <mj-text>Hello worldo</mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>
    </mj-container>
  </mj-body>
</mjml>`

try {
  const { html, errors } = mjml.mjml2html(inputMJML, { beautify: true, level: "soft" })

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
