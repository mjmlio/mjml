const mjml2html = require('./packages/mjml/lib/index')

const xml = `<mjml>
  <mj-body>
    <mj-container>
      <mj-section background-color="#2f323b" padding-bottom="20" padding-top="20">
    <mj-column>
      <mj-image src="http://191n.mj.am/img/191n/3s/x47.png" alt="Cards" width="72">
      </mj-image>
      <mj-text align="center" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
        <p style="font-size: 15px;font-weight: bold;">PAYMENT METHODS</p>
        <p>We accept all majors payments options</p>
      </mj-text>
    </mj-column>
    <mj-column>
      <mj-image src="http://191n.mj.am/img/191n/3s/x48.png" alt="Currencies" align="center" border="none" width="70" padding-left="25" padding-right="25" padding-bottom="0" padding-top="10">

      </mj-image>
      <mj-text align="center" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
        <p style="font-size: 15px;font-weight: bold;">CURRENCIES CHOICE</p>
        <p>You have the choice to pay with your own currencies</p>
      </mj-text>
    </mj-column>
    <mj-column>
      <mj-image src="http://191n.mj.am/img/191n/3s/x4y.png" alt="Express" align="center" border="none" width="82" padding-left="25" padding-right="25" padding-bottom="8" padding-top="10">

      </mj-image>
      <mj-text align="center" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
        <p style="font-size: 15px;font-weight: bold;">EXPRESS SHIPPING</p>
        <p>Delivered tomorrow before noon</p>
      </mj-text>
    </mj-column>
  </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`

console.time('mjml2html')

const { html } = mjml2html(xml, {
  beautify: true
})

if (process.argv.includes('--output')) {
  console.log(html)
}

console.timeEnd('mjml2html')
