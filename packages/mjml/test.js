var mjml = require('./lib/index')
try {
const azeaze = mjml.mjml2html(`
<mjml validate="zaea">
  <mj-head>
    <mj-title>Hello MJML</mj-title>
    <mj-font name="Raleway" href="https://fonts.googleapis.com/css?family=Raleway" />
  </mj-head>
  <mj-body>
    <mj-container>
      <mj-section background-color="#7F8385">
          <mj-column>
            <mj-button
              random-attr="wow"
              background-color="transparent"
              border="2px solid white"
              color="white"
              text-transform="uppercase"
              wow="sadness"
              inner-padding="10px"
              href="http://mjml.io" border-radius="10px"
              align="center">
              Check out promotions !
            </mj-button>
            <mj-text font-family="Raleway, 'Comic Sans MS'">
              foo © bar ≠ baz 𝌆 qux
            </mj-text>
          </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>`, { beautify: true })
} catch(e) {
  if (e.getErrors) {
  console.log(e.getErrors())
  } else {
    throw e
  }
}
