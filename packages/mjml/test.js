var mjml = require('./lib/index')
const inputMJML = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text font-family="Helvetica" />
    </mj-attributes>
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

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" font-size="18px" color="black" background-color="#FFFFFF" align="right">
            align right
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" font-size="18px" color="black" background-color="#FFFFFF" align="left">
            align left
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="white" background-color="#f45e43" border="2px solid #FFF" vertical-align="top">
            2px solid #FFF
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="white" background-color="#f45e43" border="2px dashed #FFF" vertical-align="bottom">
            2px dashed #FFF
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#4d4d4d" background-color="#f45e43" container-background-color="#FFF" padding="35px 10px">
            container-background-color & padding
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border="solid 2px #f45e43" border-radius="20px" background-color="transparent" inner-padding="15px 30px">
            Ghost button
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
          <mj-column>
            <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border-top="solid 2px #f45e43" border-bottom="solid 2px #f45e43" background-color="transparent" inner-padding="15px 30px">
              Border-top, border-bottom, transparent
            </mj-button>
          </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border-left="solid 2px #f45e43" border-right="solid 2px #f45e43" border-radius="20px" background-color="#ddddd">
            Border-left, border-right & radius
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border="solid 2px #f45e43" border-radius="20px" background-color="transparent" width="200px">
            Width 200px
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border="solid 2px #f45e43" border-radius="20px" background-color="transparent" height="80px">
            Height 80px
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#ffffff" border="solid 2px #111" border-radius="20px" background-color="#f45e43" width="200px" height="80px">
            Height 80px & Width 200px
          </mj-button>
        </mj-column>
      </mj-section>
      <!-- Enf of button -->
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
