var mjml = require('./lib/index')
const inputMJML = `<mjml>

  <mj-body>
    <mj-container background-color="#ffffaa">
      <mj-section>
        <mj-column background-color="orange">
          <mj-accordion icon-wrapped-url="https://d30y9cdsu7xlg0.cloudfront.net/png/122350-200.png">
            <mj-accordion-element padding="20px" border="2px solid black">
              <mj-accordion-title background-color="green" color="blue">Hello worldo</mj-accordion-title>
              <mj-accordion-text background-color="yellow" color="purple">Ho bienvenue !</mj-accordion-text>
            </mj-accordion-element>
            <mj-accordion-element icon-wrapped-url="https://d30y9cdsu7xlg0.cloudfront.net/png/121983-200.png" padding="20px" border="2px solid black">
              <mj-accordion-title background-color="green" color="blue">Hello worldo</mj-accordion-title>
              <mj-accordion-text background-color="yellow" color="purple">Ho bienvenue !</mj-accordion-text>
            </mj-accordion-element>
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
