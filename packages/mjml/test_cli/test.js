var mjml = require('./lib/index')

const inputMJML = `<mjml>
  <mj-body>
    <mj-container background-color="#d6dde5">
      <mj-section background-color="#fa8739" padding-bottom="0" padding-top="0">
        <mj-column width="600">
          <mj-button background-color="#fff" color="#fa8739" font-size="16px" align="center" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-left="25" padding-right="25" padding-bottom="10" padding-top="10">
            SHOP NOW
          </mj-button>
        </mj-column>
      </mj-section>
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
