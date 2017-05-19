var mjml = require('./lib/index')
const inputMJML = `
<mjml>
  <mj-head>
    <mj-style inline="inline">
      a { color: inherit; text-decoration: none }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-button href="test.com">Hello !</mj-button>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`

try {
  const { html, errors } = mjml.mjml2html(inputMJML, { beautify: true, minify: false, level: "strict" })

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
