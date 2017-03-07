var mjml = require('./lib/index')
const inputMJML = `
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column width="100%">
          <mj-invoice format="0,00.00€" intl="name:Product Name">
            <mj-invoice-item name="TV" price="549€" quantity="1" />
            <mj-invoice-item name="DVD - Iron Man II" price="22.99€" quantity="2" />
          </mj-invoice>
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
