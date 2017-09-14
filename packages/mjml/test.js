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
    <!-- Start of invoice -->
    <mj-section>
      <mj-column>
        <mj-invoice format="$0,0.00" intl="name:Desc.; quantity:Qty" border="1px solid #dc4e41" color="#dc4e41" container-background-color="#DDDDDD">
          <mj-invoice-item price="$300" quantity="1" text-align="right" name="Object 1" />
          <mj-invoice-item price="$200" quantity="2" text-align="right" name="Object 2" />
          <mj-invoice-item price="$300" quantity="1" text-align="center" name="Object 3" />
          <mj-invoice-item price="$500" quantity="1" text-align="left" name="Object 4" />
          <mj-invoice-item price="$50" quantity="1" text-align="left" name="Object 5" />
        </mj-invoice>
      </mj-column>
    </mj-section>

    <mj-section>
      <mj-column>
        <mj-invoice format="0,00.00€" intl="name:Value" border="1px dashed #dc4e41" align="center">
          <mj-invoice-item price="1000€" quantity="5" name="1000€" />
          <mj-invoice-item price="1000€" quantity="4" name="1000€" />
          <mj-invoice-item price="1000€" quantity="3" name="1000€" />
          <mj-invoice-item price="1000€" quantity="2" name="1000€" />
          <mj-invoice-item price="1000€" quantity="1" name="1000€" />
          <mj-invoice-item price="1000€" quantity="0" name="1000€" />
        </mj-invoice>
      </mj-column>

      <mj-column>
        <mj-invoice format="0,00.00â‚¬" intl="name:Value" border="1px dotted #dc4e41" align="center" container-background-color="#DDDDDD">
          <mj-invoice-item price="1000â‚¬" quantity="0" name="1000â‚¬" />
          <mj-invoice-item price="1000â‚¬" quantity="1" name="1000â‚¬" />
          <mj-invoice-item price="1000â‚¬" quantity="2" name="1000â‚¬" />
          <mj-invoice-item price="1000â‚¬" quantity="3" name="1000â‚¬" />
          <mj-invoice-item price="1000â‚¬" quantity="4" name="1000â‚¬" />
          <mj-invoice-item price="1000â‚¬" quantity="5" name="1000â‚¬" />
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
