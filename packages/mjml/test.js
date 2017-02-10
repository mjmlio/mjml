var mjml = require('./lib/index')
const inputMJML = `<mjml>

  <mj-body>
    <mj-container background-color="#ffffaa">
      <mj-section>
        <mj-column background-color="orange">
          <mj-accordion padding="20px" border="2px solid black">
            <mj-accordion-title background-color="green" color="blue">Hello worldo</mj-accordion-title>
            <mj-accordion-text background-color="yellow" color="purple">Ho bienvenue !</mj-accordion-text>
          </mj-accordion>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>`

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
